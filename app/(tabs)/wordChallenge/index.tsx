
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Platform,
} from 'react-native';
import { colors } from '@/styles/commonStyles';
import * as Haptics from 'expo-haptics';
import { IconSymbol } from '@/components/IconSymbol';

// Word list for the game
const WORD_LIST = [
  { word: 'REACT', hint: 'JavaScript library' },
  { word: 'NATIVE', hint: 'Mobile development' },
  { word: 'CODING', hint: 'Programming activity' },
  { word: 'MOBILE', hint: 'Portable device' },
  { word: 'DESIGN', hint: 'Creative process' },
  { word: 'PUZZLE', hint: 'Brain teaser' },
  { word: 'CHALLENGE', hint: 'Difficult task' },
  { word: 'VICTORY', hint: 'Winning moment' },
  { word: 'MASTER', hint: 'Expert level' },
  { word: 'GENIUS', hint: 'Very smart person' },
  { word: 'PLAYER', hint: 'Game participant' },
  { word: 'WINNER', hint: 'Champion' },
  { word: 'SCORE', hint: 'Points earned' },
  { word: 'TIMER', hint: 'Clock countdown' },
  { word: 'SPEED', hint: 'Fast pace' },
];

type GameState = 'menu' | 'playing' | 'paused' | 'gameOver' | 'victory';
type Difficulty = 'easy' | 'medium' | 'hard';

interface HighScore {
  score: number;
  difficulty: Difficulty;
  date: string;
}

export default function WordChallengeScreen() {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [currentWord, setCurrentWord] = useState('');
  const [scrambledWord, setScrambledWord] = useState('');
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [wordsCompleted, setWordsCompleted] = useState(0);
  const [hint, setHint] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [highScores, setHighScores] = useState<HighScore[]>([]);
  const [shakeAnimation] = useState(new Animated.Value(0));
  const [pulseAnimation] = useState(new Animated.Value(1));

  // Get time limit based on difficulty
  const getTimeLimit = (diff: Difficulty) => {
    switch (diff) {
      case 'easy':
        return 90;
      case 'medium':
        return 60;
      case 'hard':
        return 45;
      default:
        return 60;
    }
  };

  // Scramble a word
  const scrambleWord = (word: string) => {
    const letters = word.split('');
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [letters[i], letters[j]] = [letters[j], letters[i]];
    }
    const scrambled = letters.join('');
    return scrambled === word ? scrambleWord(word) : scrambled;
  };

  // Start a new game
  const startGame = (selectedDifficulty: Difficulty) => {
    console.log('Starting game with difficulty:', selectedDifficulty);
    setDifficulty(selectedDifficulty);
    setGameState('playing');
    setScore(0);
    setWordsCompleted(0);
    setTimeLeft(getTimeLimit(selectedDifficulty));
    setShowHint(false);
    loadNewWord();
  };

  // Load a new word
  const loadNewWord = useCallback(() => {
    const randomWord = WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];
    setCurrentWord(randomWord.word);
    setScrambledWord(scrambleWord(randomWord.word));
    setHint(randomWord.hint);
    setUserInput('');
    setShowHint(false);
  }, []);

  // Timer effect
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (gameState === 'playing' && timeLeft === 0) {
      endGame();
    }
  }, [gameState, timeLeft]);

  // Pulse animation for timer
  useEffect(() => {
    if (timeLeft <= 10 && gameState === 'playing') {
      Animated.sequence([
        Animated.timing(pulseAnimation, {
          toValue: 1.2,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnimation, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [timeLeft, gameState]);

  // Add letter to input
  const addLetter = (letter: string) => {
    if (userInput.length < currentWord.length) {
      setUserInput(userInput + letter);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  // Remove last letter
  const removeLetter = () => {
    if (userInput.length > 0) {
      setUserInput(userInput.slice(0, -1));
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  // Check answer
  const checkAnswer = () => {
    if (userInput.toUpperCase() === currentWord) {
      // Correct answer
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      const timeBonus = Math.floor(timeLeft / 10) * 10;
      const wordBonus = currentWord.length * 10;
      const newScore = score + wordBonus + timeBonus;
      setScore(newScore);
      setWordsCompleted(wordsCompleted + 1);
      loadNewWord();
    } else {
      // Wrong answer
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      shakeAnimationStart();
    }
  };

  // Shake animation for wrong answer
  const shakeAnimationStart = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // End game
  const endGame = () => {
    console.log('Game ended. Score:', score);
    setGameState('gameOver');
    
    // Save high score
    const newHighScore: HighScore = {
      score,
      difficulty,
      date: new Date().toLocaleDateString(),
    };
    
    const updatedHighScores = [...highScores, newHighScore]
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
    
    setHighScores(updatedHighScores);
  };

  // Return to menu
  const returnToMenu = () => {
    setGameState('menu');
    setUserInput('');
  };

  // Render menu screen
  const renderMenu = () => (
    <View style={styles.menuContainer}>
      <Text style={styles.gameTitle}>Word Challenge</Text>
      <Text style={styles.subtitle}>Unscramble words before time runs out!</Text>

      <View style={styles.difficultyContainer}>
        <Text style={styles.sectionTitle}>Select Difficulty</Text>
        
        <TouchableOpacity
          style={[styles.difficultyButton, styles.easyButton]}
          onPress={() => startGame('easy')}
        >
          <IconSymbol
            ios_icon_name="star.fill"
            android_material_icon_name="star"
            size={24}
            color={colors.card}
          />
          <Text style={styles.difficultyButtonText}>Easy</Text>
          <Text style={styles.difficultyTime}>90 seconds</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.difficultyButton, styles.mediumButton]}
          onPress={() => startGame('medium')}
        >
          <IconSymbol
            ios_icon_name="star.fill"
            android_material_icon_name="star"
            size={24}
            color={colors.card}
          />
          <IconSymbol
            ios_icon_name="star.fill"
            android_material_icon_name="star"
            size={24}
            color={colors.card}
          />
          <Text style={styles.difficultyButtonText}>Medium</Text>
          <Text style={styles.difficultyTime}>60 seconds</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.difficultyButton, styles.hardButton]}
          onPress={() => startGame('hard')}
        >
          <IconSymbol
            ios_icon_name="star.fill"
            android_material_icon_name="star"
            size={24}
            color={colors.card}
          />
          <IconSymbol
            ios_icon_name="star.fill"
            android_material_icon_name="star"
            size={24}
            color={colors.card}
          />
          <IconSymbol
            ios_icon_name="star.fill"
            android_material_icon_name="star"
            size={24}
            color={colors.card}
          />
          <Text style={styles.difficultyButtonText}>Hard</Text>
          <Text style={styles.difficultyTime}>45 seconds</Text>
        </TouchableOpacity>
      </View>

      {highScores.length > 0 && (
        <View style={styles.highScoresContainer}>
          <Text style={styles.sectionTitle}>High Scores</Text>
          {highScores.map((hs, index) => (
            <View key={index} style={styles.highScoreItem}>
              <Text style={styles.highScoreRank}>#{index + 1}</Text>
              <Text style={styles.highScoreText}>
                {hs.score} pts - {hs.difficulty}
              </Text>
              <Text style={styles.highScoreDate}>{hs.date}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  // Render game screen
  const renderGame = () => (
    <View style={styles.gameContainer}>
      <View style={styles.gameHeader}>
        <View style={styles.statContainer}>
          <Text style={styles.statLabel}>Score</Text>
          <Text style={styles.statValue}>{score}</Text>
        </View>

        <Animated.View
          style={[
            styles.timerContainer,
            {
              transform: [{ scale: pulseAnimation }],
            },
          ]}
        >
          <Text style={[styles.timerText, timeLeft <= 10 && styles.timerWarning]}>
            {timeLeft}s
          </Text>
        </Animated.View>

        <View style={styles.statContainer}>
          <Text style={styles.statLabel}>Words</Text>
          <Text style={styles.statValue}>{wordsCompleted}</Text>
        </View>
      </View>

      <View style={styles.wordContainer}>
        <Text style={styles.scrambledWord}>{scrambledWord}</Text>
      </View>

      <Animated.View
        style={[
          styles.inputContainer,
          {
            transform: [{ translateX: shakeAnimation }],
          },
        ]}
      >
        <Text style={styles.userInputText}>
          {userInput || '_'.repeat(currentWord.length)}
        </Text>
      </Animated.View>

      <View style={styles.lettersContainer}>
        {scrambledWord.split('').map((letter, index) => (
          <TouchableOpacity
            key={index}
            style={styles.letterButton}
            onPress={() => addLetter(letter)}
          >
            <Text style={styles.letterButtonText}>{letter}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={removeLetter}>
          <IconSymbol
            ios_icon_name="delete.left.fill"
            android_material_icon_name="backspace"
            size={24}
            color={colors.card}
          />
          <Text style={styles.actionButtonText}>Delete</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.checkButton]}
          onPress={checkAnswer}
        >
          <IconSymbol
            ios_icon_name="checkmark.circle.fill"
            android_material_icon_name="check-circle"
            size={24}
            color={colors.card}
          />
          <Text style={styles.actionButtonText}>Check</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setShowHint(!showHint)}
        >
          <IconSymbol
            ios_icon_name="lightbulb.fill"
            android_material_icon_name="lightbulb"
            size={24}
            color={colors.card}
          />
          <Text style={styles.actionButtonText}>Hint</Text>
        </TouchableOpacity>
      </View>

      {showHint && (
        <View style={styles.hintContainer}>
          <Text style={styles.hintText}>💡 {hint}</Text>
        </View>
      )}

      <TouchableOpacity style={styles.pauseButton} onPress={returnToMenu}>
        <IconSymbol
          ios_icon_name="xmark.circle.fill"
          android_material_icon_name="close"
          size={20}
          color={colors.secondary}
        />
        <Text style={styles.pauseButtonText}>Quit</Text>
      </TouchableOpacity>
    </View>
  );

  // Render game over screen
  const renderGameOver = () => (
    <View style={styles.gameOverContainer}>
      <Text style={styles.gameOverTitle}>Game Over!</Text>
      
      <View style={styles.finalStatsContainer}>
        <View style={styles.finalStatItem}>
          <Text style={styles.finalStatLabel}>Final Score</Text>
          <Text style={styles.finalStatValue}>{score}</Text>
        </View>
        
        <View style={styles.finalStatItem}>
          <Text style={styles.finalStatLabel}>Words Completed</Text>
          <Text style={styles.finalStatValue}>{wordsCompleted}</Text>
        </View>
        
        <View style={styles.finalStatItem}>
          <Text style={styles.finalStatLabel}>Difficulty</Text>
          <Text style={styles.finalStatValue}>{difficulty}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.playAgainButton}
        onPress={() => startGame(difficulty)}
      >
        <IconSymbol
          ios_icon_name="arrow.clockwise"
          android_material_icon_name="refresh"
          size={24}
          color={colors.card}
        />
        <Text style={styles.playAgainButtonText}>Play Again</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuButton} onPress={returnToMenu}>
        <Text style={styles.menuButtonText}>Back to Menu</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {gameState === 'menu' && renderMenu()}
      {gameState === 'playing' && renderGame()}
      {gameState === 'gameOver' && renderGameOver()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: Platform.OS === 'android' ? 48 : 60,
    paddingBottom: 120,
    paddingHorizontal: 20,
  },
  menuContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gameTitle: {
    fontSize: 42,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 40,
    textAlign: 'center',
  },
  difficultyContainer: {
    width: '100%',
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 15,
    textAlign: 'center',
  },
  difficultyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  easyButton: {
    backgroundColor: '#34C759',
  },
  mediumButton: {
    backgroundColor: colors.accent,
  },
  hardButton: {
    backgroundColor: colors.secondary,
  },
  difficultyButtonText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.card,
    marginLeft: 10,
    marginRight: 10,
  },
  difficultyTime: {
    fontSize: 14,
    color: colors.card,
    opacity: 0.9,
  },
  highScoresContainer: {
    width: '100%',
    backgroundColor: colors.card,
    borderRadius: 15,
    padding: 20,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  highScoreItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.background,
  },
  highScoreRank: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.highlight,
    width: 40,
  },
  highScoreText: {
    fontSize: 14,
    color: colors.text,
    flex: 1,
  },
  highScoreDate: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  gameContainer: {
    flex: 1,
    alignItems: 'center',
  },
  gameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 30,
  },
  statContainer: {
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 15,
    borderRadius: 12,
    minWidth: 80,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 5,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
  },
  timerContainer: {
    backgroundColor: colors.card,
    padding: 20,
    borderRadius: 50,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  timerText: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.primary,
  },
  timerWarning: {
    color: colors.secondary,
  },
  wordContainer: {
    backgroundColor: colors.card,
    padding: 30,
    borderRadius: 20,
    marginBottom: 30,
    width: '100%',
    alignItems: 'center',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.15)',
    elevation: 4,
  },
  scrambledWord: {
    fontSize: 36,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: 8,
  },
  inputContainer: {
    backgroundColor: colors.highlight,
    padding: 20,
    borderRadius: 15,
    marginBottom: 30,
    width: '100%',
    alignItems: 'center',
    minHeight: 70,
    justifyContent: 'center',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  userInputText: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: 6,
  },
  lettersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 30,
    gap: 10,
  },
  letterButton: {
    backgroundColor: colors.primary,
    width: 50,
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
    elevation: 3,
  },
  letterButtonText: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.card,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
    gap: 10,
  },
  actionButton: {
    flex: 1,
    backgroundColor: colors.textSecondary,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  checkButton: {
    backgroundColor: '#34C759',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.card,
  },
  hintContainer: {
    backgroundColor: colors.accent,
    padding: 15,
    borderRadius: 12,
    width: '100%',
    marginBottom: 20,
  },
  hintText: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
  },
  pauseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    gap: 8,
  },
  pauseButtonText: {
    fontSize: 16,
    color: colors.secondary,
    fontWeight: '600',
  },
  gameOverContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gameOverTitle: {
    fontSize: 42,
    fontWeight: '800',
    color: colors.secondary,
    marginBottom: 30,
    textAlign: 'center',
  },
  finalStatsContainer: {
    width: '100%',
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 25,
    marginBottom: 30,
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.15)',
    elevation: 4,
  },
  finalStatItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.background,
  },
  finalStatLabel: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  finalStatValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
  },
  playAgainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    padding: 18,
    borderRadius: 15,
    width: '100%',
    marginBottom: 15,
    gap: 10,
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  playAgainButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.card,
  },
  menuButton: {
    padding: 15,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  menuButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
});
