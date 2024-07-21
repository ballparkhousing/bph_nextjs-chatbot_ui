import * as React from 'react';
import GoogleMapComponent from './GoogleMapComponent'; // Ensure this component is updated to handle multiple polygons
import { shareChat } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { PromptForm } from '@/components/prompt-form';
import { ButtonScrollToBottom } from '@/components/button-scroll-to-bottom';
import { IconShare } from '@/components/ui/icons';
import { FooterText } from '@/components/footer';
import { ChatShareDialog } from '@/components/chat-share-dialog';
import { useAIState, useActions, useUIState } from 'ai/rsc';
import type { AI } from '@/lib/chat/actions';
import { nanoid } from 'nanoid';
import { UserMessage } from './stocks/message';
import { promptQuestion, Question, Scenario } from '@/promptQuestions';
import { searchRental } from '@/lib/rental';
import { number } from 'zod';

export interface ChatPanelProps {
  id?: string;
  title?: string;
  input: string;
  setInput: (value: string) => void;
  isAtBottom: boolean;
  scrollToBottom: () => void;
}

interface Location {
  lat: number;
  lng: number;
}

interface Locations {
  [key: string]: Location;
}

export function ChatPanel({
  id,
  title,
  input,
  setInput,
  isAtBottom,
  scrollToBottom,
}: ChatPanelProps) {
  const [aiState] = useAIState();
  const [messages, setMessages] = useUIState<typeof AI>();
  const { submitUserMessage } = useActions();
  const [shareDialogOpen, setShareDialogOpen] = React.useState(false);
  const [currentQuestionId, setCurrentQuestionId] = React.useState('');
  const [currentScenario, setCurrentScenario] = React.useState<string>('');
  const [answers, setAnswers] = React.useState({});
  const [showMap, setShowMap] = React.useState(false);
  const [mapCoords, setMapCoords] = React.useState<{ lat: number; lng: number } | null>(null);
  const [drawnShape, setDrawnShape] = React.useState(null);
  const [polygonCoords, setPolygonCoords] = React.useState<Array<Array<{ lat: number; lng: number }>> | null>(null);

  const initialScenarioSelection = [
    {
      scenario: 'renter',
      heading: 'I want to Rent',
      subheading: 'Click here if you are a Renter',
    },
    {
      scenario: 'builder',
      heading: 'I want to Build',
      subheading: 'Click here if you are a Developer',
    },
  ];

  React.useEffect(() => {
    console.log('Current Answers:', answers);
  }, [answers]);

  React.useEffect(() => {
    console.log('Rental Results:', rentalResults);
  }, [rentalResults]);

  const locations: Locations = {
    UNIVERSITY_UOFA: { lat: 53.5232, lng: -113.5263 },
    UNIVERSITY_MACEWAN: { lat: 53.5461, lng: -113.5017 },
    DOWNTOWN: { lat: 53.5461, lng: -113.4938 },
    CITY_INFILL: { lat: 53.5461, lng: -113.4938 }, // City infill coordinates
    SOUTHSIDE: { lat: 53.4836, lng: -113.5222 },
    ROGERS_AREA: { lat: 53.5465, lng: -113.4972 },
    CWB_AREA: { lat: 53.5398, lng: -113.4971 },
  };

  const sendRequest = async (responses: any) => {
    try {
      setLoading(true); // Set loading to true when request starts
      const data = await searchRental(JSON.stringify(responses));
      setRentalResults(data.results); // Set the results in state
      console.log('Rental Results:', data.results);
    } catch (error) {
      console.error('Failed to fetch rental results:', error);
    } finally {
      setLoading(false); // Set loading to false when request completes
    }
  };

  const handleOptionChange = (questionId: string, option: string) => {
    const scenario: Scenario = promptQuestion[currentScenario].scenarios[0];
    const question = scenario.questions.find((question: Question) => question.id === questionId);

    if (!question) return;

    const nextQuestionId: string =
      (question.hasOwnProperty('next') &&
        question?.next !== undefined &&
        (question?.next[option] || question?.next?.default)) ?? '';

    setCurrentQuestionId(nextQuestionId);

    const updatedAnswers = {
      ...answers,
      scenario: currentScenario,
      [questionId]: option,
    };

    setAnswers(updatedAnswers);

    // Save the responses to a JSON file if the next question is "map"
    if (nextQuestionId === 'map') {
      sendRequest(updatedAnswers);
    }

    // Check if the selected option corresponds to a location
    if (locations[option]) {
      setMapCoords(locations[option]);
      setShowMap(true);
    }

    // Check if the selected option corresponds to city infill, and set multipolygon coordinates
    if (option === 'CITY_INFILL') {
      setPolygonCoords(
        // Replace with your actual multipolygon coordinates for city infill
        [
          { lat: 53.55, lng: -113.48 },
          { lat: 53.52, lng: -113.51 },
          { lat: 53.55, lng: -113.6 },
          { lat: 53.55, lng: -113.5 },
          { lat: 53.46, lng: -113.38 },
          { lat: 53.51, lng: -113.52 },
          { lat: 53.53, lng: -113.5 },
          { lat: 53.51, lng: -113.62 },
          { lat: 53.53, lng: -113.5 },
          { lat: 53.54, lng: -113.42 },
          { lat: 53.44, lng: -113.41 },
          { lat: 53.56, lng: -113.51 },
          { lat: 53.55, lng: -113.53 },
          { lat: 53.52, lng: -113.51 },
          { lat: 53.44, lng: -113.57 },
          { lat: 53.59, lng: -113.53 },
          { lat: 53.54, lng: -113.48 },
          { lat: 53.47, lng: -113.4 },
          { lat: 53.46, lng: -113.4 },
          { lat: 53.58, lng: -113.46 },
          { lat: 53.54, lng: -113.59 },
          { lat: 53.6, lng: -113.39 }
      ]);
    } else {
      setPolygonCoords(null);
    }
  };

  const renderQuestions = (questions: Question[], questionId: string) => {
    const questionObj = questions.find((question: Question) => question.id === questionId);
    if (!questionObj) return;

    const { question, options } = questionObj;

    return (
      <div className="mb-4">
        <p className="text-sm mb-2 font-semibold">{question}</p>
        <div className="mb-4 grid grid-cols-2 gap-2 px-4 sm:px-0">
          {options.map((option: string) => (
            <div
              key={option}
              onClick={() => handleOptionChange(questionId, option)}
              className={`cursor-pointer rounded-lg border bg-white p-4 hover:bg-zinc-50 dark:bg-zinc-950 dark:hover:bg-zinc-900`}
            >
              <div className="text-sm font-semibold">{option}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-x-0 bottom-0 w-full bg-gradient-to-b from-muted/30 from-0% to-muted/30 to-50% duration-300 ease-in-out animate-in dark:from-background/10 dark:from-10% dark:to-background/80 peer-[[data-state=open]]:group-[]:lg:pl-[250px] peer-[[data-state=open]]:group-[]:xl:pl-[300px]">
      <ButtonScrollToBottom isAtBottom={isAtBottom} scrollToBottom={scrollToBottom} />

      <div className="mx-auto sm:max-w-2xl sm:px-4">
        <div className={`${currentScenario.length !== 0 && 'hidden'} mb-4 grid grid-cols-2 gap-2 px-4 sm:px-0`}>
          {initialScenarioSelection.map(({ scenario, heading, subheading }) => (
            <div
              key={scenario}
              onClick={() => {
                setCurrentScenario(scenario);
                const questionId = promptQuestion[scenario].scenarios[0].questions[0].id;
                setCurrentQuestionId(questionId);
              }}
              className={`cursor-pointer rounded-lg border bg-white p-4 hover:bg-zinc-50 dark:bg-zinc-950 dark:hover:bg-zinc-900`}
            >
              <div className="text-sm font-semibold">{heading}</div>
              <div className="text-xs">{subheading}</div>
            </div>
          ))}
        </div>

        {currentScenario.length !== 0 && (
          <>
            <div>{renderQuestions(promptQuestion[currentScenario].scenarios[0].questions, currentQuestionId)}</div>

            {/* {showMap && mapCoords && (
              <div>
                <GoogleMapComponent
                  coords={mapCoords}
                  drawnShape={drawnShape}
                  setDrawnShape={setDrawnShape}
                  polygonCoords={polygonCoords}
                />
              </div>
            )} */}
          </>
        )}

        {/* Display rental results one by one */}
        {rentalResults.length > 0 && rentalResults.map((result, index) => (
          <div key={index} className="mb-4 border rounded-lg p-4">
            <GoogleMapComponent
              coords={{ lat: number(result.latitude), lng: number(result.longitude) }}
              drawnShape={drawnShape}
              setDrawnShape={setDrawnShape}
              polygonCoords={polygonCoords}
            />
            <div className="mt-4">
              <h3 className="text-lg font-semibold">{result.recommendation_summary}</h3>
              <p className="text-sm">Type: {result.type}</p>
              <p className="text-sm">Price: {result.price}</p>
              <p className="text-sm">Address: {result.address}</p>
              {result.photos.length > 0 &&  result.photos.map((photo: string | undefined, index: any) => (
                // eslint-disable-next-line @next/next/no-img-element, react/jsx-key
                <img src={photo} alt="Property" className="mt-2 rounded-lg" width="200" />
              )
              )}
            </div>
          </div>
        ))}
        {loading && <p>Loading...</p>}

        <div className="pb-[150px] pt-4 sm:pb-[90px]">
          {messages.length > 0 ? (
            <div className="px-4 sm:px-0">
              {id && (
                <div className="flex w-full items-center justify-center pb-4 pt-2">
                  <Button
                    variant="outline"
                    className="border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-black"
                    onClick={() => setShareDialogOpen(true)}
                  >
                    <IconShare className="mr-2 size-4" />
                    Share
                  </Button>
                </div>
              )}

              {messages.map((message, index) => (
                <UserMessage key={index} message={message} />
              ))}

              {shareDialogOpen ? (
                <ChatShareDialog
                  id={id!}
                  title={title!}
                  open={shareDialogOpen}
                  setOpen={setShareDialogOpen}
                  shareChatMutation={shareChat}
                />
              ) : null}

              {/* Display rental results one by one */}
              {rentalResults.length > 0 && rentalResults.map((result, index) => (
                <div key={index} className="mb-4 border rounded-lg p-4">
                  <GoogleMapComponent
                    coords={{ lat: parseFloat(result.latitude), lng: parseFloat(result.longitude) }}
                    drawnShape={drawnShape}
                    setDrawnShape={setDrawnShape}
                    polygonCoords={polygonCoords}
                  />
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold">{result.recommendation_summary}</h3>
                    <p className="text-sm">Type: {result.type}</p>
                    <p className="text-sm">Price: {result.price}</p>
                    <p className="text-sm">Address: {result.address}</p>
                    {result.photos.length > 0 && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={result.photos[0]} alt="Property" className="mt-2 rounded-lg" width="200" />
                    )}
                  </div>
                </div>
              ))}
              {loading && <p>Loading...</p>}
            </div>
          ) : (
            <div className="mt-6 flex justify-center px-4 text-center text-sm text-muted-foreground sm:px-0">
              {id ? (
                <span className="block">Type a message or click the dice to get a random question.</span>
              ) : (
                <div className="flex items-center">
                  <span className="block">Type a message or click the dice to get a random question.</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
