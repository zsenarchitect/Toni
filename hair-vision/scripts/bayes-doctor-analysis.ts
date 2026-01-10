
/**
 * Misleading Doctor Endorsement Analysis
 * 
 * This script analyzes the classic "More doctors smoke Camels than any other cigarette" advertisement
 * using Bayesian probability and statistical simulation.
 * 
 * It demonstrates how the ad uses a high conditional probability P(Camel | Smoker, Doctor)
 * to distract from the more important base rate P(Smoker | Doctor).
 */

interface Population {
  doctors: number;
  generalPublic: number;
}

interface SmokerStats {
  doctorSmokingRate: number; // P(Smoker | Doctor)
  publicSmokingRate: number; // P(Smoker | Public)
}

interface BrandPreferences {
  camel: number;       // P(Camel | Smoker)
  luckyStrike: number; // P(LuckyStrike | Smoker)
  chesterfield: number; // P(Chesterfield | Smoker)
  other: number;       // P(Other | Smoker)
}

function runAnalysis() {
  console.log("=== 1930s Advertising Analysis: 'More Doctors Smoke Camels' ===\n");

  // 1. Setup Parameters (Hypothetical but realistic for the era/point)
  const TOTAL_POPULATION = 100000;
  
  // Doctors are a small subset of the population
  const P_DOCTOR = 0.02; // 2% are doctors
  
  // Smoking rates (Hypothesis: Doctors might actually smoke less or similar, 
  // but the ad implies endorsement)
  // Let's assume a significant portion of doctors DON'T smoke, which is the ignored prior.
  const P_SMOKER_GIVEN_DOCTOR = 0.30; // 30% of doctors smoke
  const P_SMOKER_GIVEN_PUBLIC = 0.45; // 45% of general public smoke
  
  // Brand preferences among Doctors who DO smoke
  // The ad claims "More doctors smoke Camels", implying Camels have the highest share.
  const BRAND_PREFS_DOCTORS: BrandPreferences = {
    camel: 0.40,        // 40% of smoking doctors choose Camel
    luckyStrike: 0.25,  // 25%
    chesterfield: 0.25, // 25%
    other: 0.10         // 10%
  };

  // 2. Calculate Counts
  const totalDoctors = TOTAL_POPULATION * P_DOCTOR;
  const smokingDoctors = totalDoctors * P_SMOKER_GIVEN_DOCTOR;
  const nonSmokingDoctors = totalDoctors * (1 - P_SMOKER_GIVEN_DOCTOR);
  
  const camelSmokingDoctors = smokingDoctors * BRAND_PREFS_DOCTORS.camel;
  const luckySmokingDoctors = smokingDoctors * BRAND_PREFS_DOCTORS.luckyStrike;
  const otherSmokingDoctors = smokingDoctors * (BRAND_PREFS_DOCTORS.chesterfield + BRAND_PREFS_DOCTORS.other);

  // 3. The "Ad" Logic
  console.log("--- The Advertisement's Perspective ---");
  console.log(`Survey of ${totalDoctors} doctors found:`);
  console.log(`- Doctors smoking Camels: ${Math.round(camelSmokingDoctors)}`);
  console.log(`- Doctors smoking Lucky Strikes: ${Math.round(luckySmokingDoctors)}`);
  console.log(`- Doctors smoking Others: ${Math.round(otherSmokingDoctors)}`);
  console.log("\nHEADLINE: \"More doctors smoke Camels than any other cigarette!\"");
  console.log("(Technically true: Camel is the mode of the distribution P(Brand | Doctor, Smoker))");

  // 4. The Bayesian Reality Check
  console.log("\n--- The Bayesian Reality (What is hidden) ---");
  
  // P(Camel | Doctor) = P(Camel | Smoker, Doctor) * P(Smoker | Doctor)
  // We assume P(Camel | Non-Smoker, Doctor) is 0.
  const P_CAMEL_GIVEN_DOCTOR = BRAND_PREFS_DOCTORS.camel * P_SMOKER_GIVEN_DOCTOR;
  
  console.log(`Total Doctors: ${totalDoctors}`);
  console.log(`Non-Smoking Doctors: ${Math.round(nonSmokingDoctors)} (${((1 - P_SMOKER_GIVEN_DOCTOR) * 100).toFixed(1)}%)`);
  console.log(`Smoking Doctors: ${Math.round(smokingDoctors)} (${(P_SMOKER_GIVEN_DOCTOR * 100).toFixed(1)}%)`);
  
  console.log("\nKey Probabilities:");
  console.log(`P(Smoker | Doctor) = ${P_SMOKER_GIVEN_DOCTOR.toFixed(2)} (The Base Rate)`);
  console.log(`P(Camel | Smoker, Doctor) = ${BRAND_PREFS_DOCTORS.camel.toFixed(2)} (The Conditional Probability highlighted)`);
  console.log(`P(Camel | Doctor) = ${P_CAMEL_GIVEN_DOCTOR.toFixed(3)} (The Real Impact)`);

  console.log("\nConclusion:");
  console.log("The ad implies that P(Healthy | Camel) is high because Doctors choose it.");
  console.log("It leverages the authority of 'Doctor' while ignoring that most doctors might not smoke at all (or that the smoking rate is the key metric).");
  console.log(`If you pick a random doctor, there is a ${((1 - P_SMOKER_GIVEN_DOCTOR) * 100).toFixed(1)}% chance they don't smoke at all.`);
  console.log(`The fact that ${Math.round(camelSmokingDoctors)} choose Camel is insignificant compared to the ${Math.round(nonSmokingDoctors)} who choose 'Fresh Air'.`);
  
  // 5. Comparison to "Choosing Fresh Air"
  const nonSmokers = nonSmokingDoctors;
  if (nonSmokers > camelSmokingDoctors) {
    console.log(`\nIf 'Not Smoking' was a brand, it would beat Camels by a factor of ${(nonSmokers / camelSmokingDoctors).toFixed(1)}x among doctors.`);
  }

  // 6. Application to Marketing Strategy (Hair Vision)
  console.log("\n\n=== APPLICATION: The 'Elite Salon' Strategy ===");
  console.log("Goal: Position Hair Vision as the standard for top-tier salons (like Doctors and Camels).");
  
  const totalSalons = 1000;
  const eliteSalons = totalSalons * 0.10; // 10% are "Elite"
  const aiAdoptionRate = 0.15; // Only 15% of elite salons use AI (Base Rate is low!)
  
  // Of those elite salons that DO use AI, we want a high share
  const hairVisionShare = 0.60; // 60% of AI-using elite salons use Hair Vision
  
  const eliteUsingHairVision = eliteSalons * aiAdoptionRate * hairVisionShare;
  const eliteUsingOtherAI = eliteSalons * aiAdoptionRate * (1 - hairVisionShare);
  const eliteUsingNoAI = eliteSalons * (1 - aiAdoptionRate);
  
  console.log("\nThe Reality:");
  console.log(`- Total Elite Salons: ${eliteSalons}`);
  console.log(`- Elite Salons using NO AI: ${Math.round(eliteUsingNoAI)} (The 'Non-Smokers')`);
  console.log(`- Elite Salons using Hair Vision: ${Math.round(eliteUsingHairVision)}`);
  console.log(`- Elite Salons using Competitors: ${Math.round(eliteUsingOtherAI)}`);
  
  console.log("\nThe Pitch (Bayesian Twist):");
  console.log(`"Among top-rated salons that have modernized with AI, ${Math.round(hairVisionShare * 100)}% choose Hair Vision."`);
  console.log("OR simpler:");
  console.log(`"More top-rated salons choose Hair Vision than any other AI platform."`);
  console.log("(Ignored fact: Most top-rated salons choose NOTHING yet.)");
  
  console.log("\nWhy this works:");
  console.log("It creates a Normative Social Influence. The target thinks: 'If I want to be a top salon, I should do what the other top salons are doing.'");
  console.log("They conflate P(Hair Vision | Elite) with P(Hair Vision | Elite, AI-User).");

  // 7. The "Selection Bias" Strategy (User's Insight)
  console.log("\n\n=== APPLICATION 2: The 'Selection Bias' / Exclusive Access Strategy ===");
  console.log("Insight: You pre-filter shops that are likely to convert, but present the high conversion rate as a general market trend.");
  
  // Model Parameters
  const totalMarket = 1000;
  const generalInterestRate = 0.05; // Only 5% of ALL shops want it right now (50 shops)
  
  // Your Filtering Process (The "Hidden Fact")
  // You identify 100 shops that fit your "Ideal Customer Profile" (ICP)
  const filteredListSize = 100;
  // Your filter is good: It captures a high density of interested shops
  const interestedInFiltered = 40; // 40 of these 100 want it (40% conversion!)
  const interestedInRest = 10;     // 10 of the remaining 900 want it (1.1% conversion)
  
  console.log("\nThe Data:");
  console.log(`- Total Market: ${totalMarket} salons`);
  console.log(`- Your Filtered List: ${filteredListSize} salons (The ones you visit)`);
  console.log(`- Interested Salons in your list: ${interestedInFiltered} (Conversion Rate: ${(interestedInFiltered/filteredListSize*100).toFixed(0)}%)`);
  
  console.log("\nThe Pitch:");
  console.log(`"We're seeing a ${(interestedInFiltered/filteredListSize*100).toFixed(0)}% adoption rate among the salons we've selected for our beta program."`);
  console.log("or");
  console.log(`"Almost half of the salons we talk to are signing up immediately."`);
  
  console.log("\nThe Reality (Hidden):");
  console.log(`- If you walked into random shops, conversion would be ${(50/1000*100).toFixed(1)}%.`);
  console.log(`- You are leveraging P(Interest | Filtered) to imply High P(Interest | General).`);
  
  console.log("\nStrategic Benefit:");
  console.log("1. Validation: 'This product works.'");
  console.log("2. Scarcity: 'We only work with selected salons.' (Justifying the filter)");
  console.log("3. FOMO: 'If 40% are saying yes, I might be missing out.'");
}

runAnalysis();
