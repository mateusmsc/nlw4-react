import { createContext, useState, ReactNode, useEffect } from 'react';
import challenges from '../../challenges.json';

interface challenge {
  type: 'body' | 'eye';
  description: string;
  amount: number;
}

interface ChallengesContextData {
  level: number;
  currentExperience: number;
  challengesCompleted:number;
  activeChallenge: challenge;
  experieceToNextLevel: number;
  levelUp: () => void;
  startNewChallenge: () => void;
  resetChallenge: () => void;
  completeChallenge: () => void;
}


interface ChallengesProviderProps {
  children: ReactNode;
}

export const ChallengesContext = createContext({} as ChallengesContextData);

export function ChallengesProvider({ children } : ChallengesProviderProps){

  // variáveis de estado
  const [level, setLevel] = useState(1);
  const [currentExperience, setCurrenceExperience] = useState(30);
  const [challengesCompleted, setChallengesCompleted] = useState(0);
  const [activeChallenge, setActiveChallenge] =   useState(null);

  const experieceToNextLevel = Math.pow((level + 1) * 4, 2);

  useEffect(() => {
    Notification.requestPermission();
  }, []);

  function levelUp() {
    setLevel(level +1);
  }
  
  function startNewChallenge(){
      const randomChallengeIndex = Math.floor (Math.random() * challenges.length);
      const challenge = challenges[randomChallengeIndex];

      setActiveChallenge(challenge);

      new Audio('/notification.mp3').play();

      if ( Notification.permission == 'granted'){
        new Notification('Novo desafio',{
          body: `Valendo ${challenge.amount}xp!`
        });
      }
  }

  function resetChallenge (){
    setActiveChallenge(null);
  }

  function completeChallenge(){
    if (!activeChallenge){
      return;
    }

    const { amount } = activeChallenge;

    let finalExperience = currentExperience + amount;

    if( finalExperience >= experieceToNextLevel){
      levelUp();
      finalExperience = finalExperience - experieceToNextLevel;
    }

    setCurrenceExperience(finalExperience);
    setActiveChallenge(null);
    setChallengesCompleted(challengesCompleted + 1);
  }

  return (
    <ChallengesContext.Provider 
      value = {{
        level,
        currentExperience,
        activeChallenge,
        challengesCompleted, 
        experieceToNextLevel,
        levelUp,
        startNewChallenge,
        resetChallenge,
        completeChallenge,
      }}
    >
      {children}
    </ChallengesContext.Provider>
  );
}