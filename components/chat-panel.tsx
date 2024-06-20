
import * as React from 'react'
import GoogleMapComponent from './GoogleMapComponent'; // Make sure to create this component

import { shareChat } from '@/app/actions'
import { Button } from '@/components/ui/button'
import { PromptForm } from '@/components/prompt-form'
import { ButtonScrollToBottom } from '@/components/button-scroll-to-bottom'
import { IconShare } from '@/components/ui/icons'
import { FooterText } from '@/components/footer'
import { ChatShareDialog } from '@/components/chat-share-dialog'
import { useAIState, useActions, useUIState } from 'ai/rsc'
import type { AI } from '@/lib/chat/actions'
import { nanoid } from 'nanoid'
import { UserMessage } from './stocks/message'
import { promptQuestion } from '@/promptQuestions'

export interface ChatPanelProps {
  id?: string
  title?: string
  input: string
  setInput: (value: string) => void
  isAtBottom: boolean
  scrollToBottom: () => void
}

export function ChatPanel({
  id,
  title,
  input,
  setInput,
  isAtBottom,
  scrollToBottom
}: ChatPanelProps) {
  const [aiState] = useAIState()
  const [messages, setMessages] = useUIState<typeof AI>()
  const { submitUserMessage } = useActions()
  const [shareDialogOpen, setShareDialogOpen] = React.useState(false)
  const [currentQuestionId, setCurrentQuestionId] = React.useState('')
  const [currentScenario, setCurrentScenario] = React.useState(null);
  const [answers, setAnswers] = React.useState({});
  const [showMap, setShowMap] = React.useState(false);
  const [mapCoords, setMapCoords] = React.useState<{ lat: number, lng: number } | null>(null);

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
  ]

  React.useEffect(() => {
    console.log(answers);
  }, [answers]);

  const locations = {
    UNIVERSITY: { lat: 53.5232, lng: -113.5263 },
    DOWNTOWN: { lat:53.5444, lng: -113.4909},
    SOUTHSIDE: { lat:53.4836, lng: -113.5222}
    
    // MACEWAN: { lat: 53.5444, lng: -113.4909 },
    // Add more locations here
  };

  const handleOptionChange = (questionId: any, option: any) => {
    const nextQuestionId = promptQuestion[currentScenario].scenarios[0].questions.find(q => q.id === questionId).next?.[option] || promptQuestion[currentScenario].scenarios[0].questions.find(q => q.id === questionId).next?.default
    setCurrentQuestionId(nextQuestionId);

    if (!answers[questionId]) {
      setAnswers({
        scenario: currentScenario,
        ...answers,
        [questionId]: option
      })
    };

    // Check if the selected option corresponds to a location
    if (locations[option]) {
      setMapCoords(locations[option]);
      setShowMap(true);
    }
  };


  const renderQuestions = (questions, questionId) => {
    const questionObj = questions.find(q => q.id === questionId)
    if (!questionObj) return null

    const { question, options } = questionObj;

    return (
      <div className="mb-4">
        <p className="text-sm mb-2 font-semibold">{question}</p>
          <div className="mb-4 grid grid-cols-2 gap-2 px-4 sm:px-0">
            {options.map(option => (
              <div key={option} onClick={() => handleOptionChange(questionId, option)} className={`cursor-pointer rounded-lg border bg-white p-4 hover:bg-zinc-50 dark:bg-zinc-950 dark:hover:bg-zinc-900`}>
                <div className="text-sm font-semibold">{option}</div>
              </div>
            ))}
          </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-x-0 bottom-0 w-full bg-gradient-to-b from-muted/30 from-0% to-muted/30 to-50% duration-300 ease-in-out animate-in dark:from-background/10 dark:from-10% dark:to-background/80 peer-[[data-state=open]]:group-[]:lg:pl-[250px] peer-[[data-state=open]]:group-[]:xl:pl-[300px]">
      <ButtonScrollToBottom
        isAtBottom={isAtBottom}
        scrollToBottom={scrollToBottom}
      />

      <div className="mx-auto sm:max-w-2xl sm:px-4">
          <div className={`${currentScenario !== null && 'hidden'} mb-4 grid grid-cols-2 gap-2 px-4 sm:px-0`}>            
            {initialScenarioSelection.map(({scenario, heading, subheading}) => (
              <div key={scenario} onClick={() => {
                setCurrentScenario(scenario);
                
                if (currentScenario === null) {
                  setCurrentQuestionId(promptQuestion[scenario].scenarios[0].questions[0].id);
                }
              }} 
              className={`cursor-pointer rounded-lg border bg-white p-4 hover:bg-zinc-50 dark:bg-zinc-950 dark:hover:bg-zinc-900`}>
                <div className="text-sm font-semibold">{heading}</div>
                <div className="text-sm text-zinc-600">
                  {subheading}
                </div>
              </div>
              ))}
          </div>

        {currentScenario && renderQuestions(
            promptQuestion[currentScenario].scenarios[0].questions, currentQuestionId
          )
        }

        {/* Conditionally render the GoogleMapComponent */}
        {showMap && mapCoords && (
          <GoogleMapComponent lat={mapCoords.lat} lng={mapCoords.lng} zoom={15} />
        )}

        <div className="space-y-4 border-t bg-background px-4 py-2 shadow-lg sm:rounded-t-xl sm:border md:py-4">
          <PromptForm input={input} setInput={setInput} />
          <FooterText className="hidden sm:block" />
        </div>
      </div>
    </div>
  )
}

