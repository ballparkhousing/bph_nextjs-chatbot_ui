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
import {promptQuestion, Question, Scenario} from '@/promptQuestions';


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
  scrollToBottom
}: ChatPanelProps) {
  const [aiState] = useAIState();
  const [messages, setMessages] = useUIState<typeof AI>();
  const { submitUserMessage } = useActions();
  const [shareDialogOpen, setShareDialogOpen] = React.useState(false);
  const [currentQuestionId, setCurrentQuestionId] = React.useState('');
  const [currentScenario, setCurrentScenario] = React.useState<string>("");
  const [answers, setAnswers] = React.useState({});
  const [showMap, setShowMap] = React.useState(false);
  const [mapCoords, setMapCoords] = React.useState<{ lat: number, lng: number } | null>(null);
  const [drawnShape, setDrawnShape] = React.useState(null);
  const [polygonCoords, setPolygonCoords] = React.useState<Array<Array<{ lat: number; lng: number }>> | null>(null);

  const initialScenarioSelection = [
    {
      scenario: 'renter',
      heading: 'I want to Rent',
      subheading: 'Click here if you are a Renter'
    },
    {
      scenario: 'builder',
      heading: 'I want to Build',
      subheading: `Click here if you are a Developer`
    }
  ];

  React.useEffect(() => {
    console.log("Current Answers:", answers);
  }, [answers]);

  const locations: Locations = {
    UNIVERSITY_UOFA: { lat: 53.5232, lng: -113.5263 },
    UNIVERSITY_MACEWAN: { lat: 53.5461, lng: -113.5017 },
    DOWNTOWN: { lat: 53.5461, lng: -113.4938 },
    CITY_INFILL: { lat: 53.41280, lng: -113.4633 }, // City infill coordinates
    // SUBURBS: { lat: 53.4236, lng: -113.5850 },
    SOUTHSIDE: { lat: 53.4836, lng: -113.5222 },
    ROGERS_AREA: { lat: 53.5465, lng: -113.4972 },
    CWB_AREA: { lat: 53.5398, lng: -113.4971 },
  };

  const handleOptionChange = (questionId: string, option: string) => {
    const scenario: Scenario = promptQuestion[currentScenario].scenarios[0];
    const question = scenario.questions.find((question: Question) => question.id === questionId);

    if (!question) return;

    const nextQuestionId: string =
        (question.hasOwnProperty("next") &&
            question?.next !== undefined &&
            (question?.next[option] || question?.next?.default)) ?? '';

    setCurrentQuestionId(nextQuestionId);

    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      scenario: currentScenario,
      [questionId]: option
    }));

    // Check if the selected option corresponds to a location
    if (locations[option]) {
      setMapCoords(locations[option]);
      setShowMap(true);
    }

    // Check if the selected option corresponds to city infill, and set multipolygon coordinates
    if (option === 'CITY_INFILL') {
      setPolygonCoords([
        // Replace with your actual multipolygon coordinates for city infill
        [
          { lat: 53.41395613907227, lng: -113.46405030242478 },
          { lat: 53.41349671510333, lng: -113.46405051768666 },
          { lat: 53.41341131902844, lng: -113.46404550432999 },
          { lat: 53.41342841077599, lng: -113.46366797169718 }
        ],

        [
          { lat: 53.41339173673339, lng: -113.4631592712707 },
          { lat: 53.41332082341116, lng: -113.46268421135665 },
          { lat: 53.41322170651332, lng: -113.46229152484769 },
          { lat: 53.41303907897748, lng: -113.46179784311077 }
        ],

        [
          { lat: 53.41286164159375, lng: -113.46145917115864 },
          { lat: 53.41260729607444, lng: -113.46107719994447 },
          { lat: 53.412725848545314, lng: -113.46069617276413 },
          { lat: 53.412802166511774, lng: -113.46033645790904 }
        ],
        [
          { lat: 53.412854954221, lng: -113.4599444276959 },
          { lat: 53.41287515806032, lng: -113.45952889079341 },
          { lat: 53.412874940350335, lng: -113.45926659318334 },
          { lat: 53.41296196193292, lng: -113.45926200756216 },
          { lat: 53.415314432766934, lng: -113.45926590318649 }

        ],
        [
          { lat: 53.41531430486315, lng: -113.46038023638103 },
          { lat: 53.415493974609845, lng: -113.46068108110167 },
          { lat: 53.416246459288175, lng: -113.46068137380644 },
          { lat: 53.416246058469795, lng: -113.46161009725594 }
        ],
        [
          { lat: 53.416246286484416, lng: -113.46229102935166 },
          { lat: 53.416246076679634, lng: -113.46317566637221 },
          { lat: 53.41624610390798, lng: -113.46382547084825 },
          { lat: 53.416244893149184, lng: -113.46394571361368 }
        ],
        [
          { lat: 53.41624608479272, lng: -113.4640021918837 },
          { lat: 53.416246078586205, lng: -113.46404986782895 },
          { lat: 53.41455692091663, lng: -113.46405013441276 },
          { lat: 53.41455677078354, lng: -113.46501497329925 }
        ],
        [
          { lat: 53.41455691649562, lng: -113.4657965382786 },
          { lat: 53.41455667203773, lng: -113.4667685693643 },
          { lat: 53.41349385887247, lng: -113.46676922597571 },
          { lat: 53.41350834895336, lng: -113.46659250075848 },
          { lat: 53.4135269652993, lng: -113.46640673699012 },
          { lat: 53.41358348560569, lng: -113.46604435726562 }
        ],
        [
          { lat: 53.41366539228268, lng: -113.46568209005986 },
          { lat: 53.413714603738775, lng: -113.46550541724868 },
          { lat: 53.413765956445445, lng: -113.46531973334575 },
          { lat: 53.4138059087287, lng: -113.46514302996852 },
          { lat: 53.41384751335187, lng: -113.4649573081401 },
          { lat: 53.4139064255869, lng: -113.46459486061094 },
          { lat: 53.41394450311096, lng: -113.46423242123221 },
          { lat: 53.41395613907227, lng: -113.46405030242478 }
        ],
        // [
        //   { lat: 53.41394450311096, lng: -113.46423242123221 },
        //   { lat: 53.41395613907227, lng: -113.46405030242478 },
        
        
        //   { lat: 53.5460, lng: -113.5100 },
        //   { lat: 53.5475, lng: -113.5000 },
        //   { lat: 53.5417, lng: -113.4934 },
        //   { lat: 53.5358, lng: -113.5030 }
        // ]
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
            <div key={option} onClick={() => handleOptionChange(questionId, option)} className={`cursor-pointer rounded-lg border bg-white p-4 hover:bg-zinc-50 dark:bg-zinc-950 dark:hover:bg-zinc-900`}>
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
        <div className={`${currentScenario.length !== 0  && 'hidden'} mb-4 grid grid-cols-2 gap-2 px-4 sm:px-0`}>
          {initialScenarioSelection.map(({ scenario, heading, subheading }) => (
            <div key={scenario} onClick={() => {
              setCurrentScenario(scenario);
              setCurrentQuestionId(promptQuestion[scenario].scenarios[0].questions[0].id);
            }} className={`cursor-pointer rounded-lg border bg-white p-4 hover:bg-zinc-50 dark:bg-zinc-950 dark:hover:bg-zinc-900`}>
              <div className="text-sm font-semibold">{heading}</div>
              <div className="text-sm text-zinc-600">
                {subheading}
              </div>
            </div>
          ))}
        </div>

        {currentScenario.length !== 0 && renderQuestions(
          promptQuestion[currentScenario].scenarios[0].questions, currentQuestionId
        )}

        {/* Conditionally render the GoogleMapComponent */}
        {showMap && mapCoords && (
          <div>
            <p className="text-sm mb-2 font-semibold">Drag, zoom, and draw to select the area you want</p>
            <GoogleMapComponent
              lat={mapCoords.lat}
              lng={mapCoords.lng}
              zoom={15}
              onShapeComplete={(shape) => setDrawnShape(shape)}
              polygonCoords={polygonCoords} // Pass multipolygon coordinates to GoogleMapComponent
            />
          </div>
        )}

        <div className="space-y-4 border-t bg-background px-4 py-2 shadow-lg sm:rounded-t-xl sm:border md:py-4">
          <PromptForm input={input} setInput={setInput} />
          <FooterText className="hidden sm:block" />
        </div>
      </div>
    </div>
  );
}
