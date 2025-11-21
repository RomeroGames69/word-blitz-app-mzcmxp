
import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useTheme } from "@react-navigation/native";
import { router } from "expo-router";
import { colors } from "@/styles/commonStyles";
import { IconSymbol } from "@/components/IconSymbol";

export default function HomeScreen() {
  const theme = useTheme();

  const navigateToWordChallenge = () => {
    router.push('/(tabs)/wordChallenge/');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Word Challenge</Text>
          <Text style={styles.subtitle}>Test your word skills with time challenges!</Text>
        </View>

        <TouchableOpacity
          style={styles.playCard}
          onPress={navigateToWordChallenge}
          activeOpacity={0.8}
        >
          <View style={styles.playIconContainer}>
            <IconSymbol
              ios_icon_name="play.circle.fill"
              android_material_icon_name="play-circle"
              size={80}
              color={colors.primary}
            />
          </View>
          <Text style={styles.playCardTitle}>Start Playing</Text>
          <Text style={styles.playCardDescription}>
            Unscramble words before time runs out
          </Text>
        </TouchableOpacity>

        <View style={styles.featuresContainer}>
          <Text style={styles.featuresTitle}>Game Features</Text>
          
          <View style={styles.featureItem}>
            <IconSymbol
              ios_icon_name="clock.fill"
              android_material_icon_name="schedule"
              size={32}
              color={colors.primary}
            />
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>Time Challenges</Text>
              <Text style={styles.featureDescription}>
                Race against the clock to solve word puzzles
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <IconSymbol
              ios_icon_name="star.fill"
              android_material_icon_name="star"
              size={32}
              color={colors.accent}
            />
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>Multiple Difficulties</Text>
              <Text style={styles.featureDescription}>
                Choose from Easy, Medium, or Hard modes
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <IconSymbol
              ios_icon_name="trophy.fill"
              android_material_icon_name="emoji-events"
              size={32}
              color={colors.highlight}
            />
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>High Scores</Text>
              <Text style={styles.featureDescription}>
                Track your best performances and compete with yourself
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <IconSymbol
              ios_icon_name="lightbulb.fill"
              android_material_icon_name="lightbulb"
              size={32}
              color={colors.secondary}
            />
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>Helpful Hints</Text>
              <Text style={styles.featureDescription}>
                Get hints when you&apos;re stuck on a word
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>How to Play</Text>
          <Text style={styles.instructionText}>
            1. Select your difficulty level
          </Text>
          <Text style={styles.instructionText}>
            2. Unscramble the letters to form a word
          </Text>
          <Text style={styles.instructionText}>
            3. Tap letters to build your answer
          </Text>
          <Text style={styles.instructionText}>
            4. Check your answer before time runs out
          </Text>
          <Text style={styles.instructionText}>
            5. Complete as many words as possible!
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingTop: 48,
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  playCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    marginBottom: 30,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    elevation: 4,
  },
  playIconContainer: {
    marginBottom: 20,
  },
  playCardTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  playCardDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  featuresContainer: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 20,
    marginBottom: 30,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  featuresTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  featureTextContainer: {
    flex: 1,
    marginLeft: 15,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  instructionsContainer: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 20,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  instructionsTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 15,
    textAlign: 'center',
  },
  instructionText: {
    fontSize: 15,
    color: colors.text,
    marginBottom: 10,
    lineHeight: 22,
  },
});
