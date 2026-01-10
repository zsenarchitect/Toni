
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
}

runAnalysis();
