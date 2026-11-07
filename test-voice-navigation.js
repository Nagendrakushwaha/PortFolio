/**
 * Voice Navigation Router Test Suite
 * Tests deterministic intent resolution and spoken responses for all acceptance commands
 */

import { matchNavigationIntent } from './server/voice-navigation.js';

console.log('====================================================');
console.log('RUNNING MR. KENNADY VOICE NAVIGATION TEST SUITE');
console.log('====================================================\n');

let passed = 0;
let failed = 0;

function assert(condition, testName, extraInfo = '') {
  if (condition) {
    console.log(`[PASS] ${testName}`);
    passed++;
  } else {
    console.error(`[FAIL] ${testName} ${extraInfo}`);
    failed++;
  }
}

// ACCEPTANCE TEST 1: "Open my projects."
{
  const res = matchNavigationIntent("Open my projects.");
  assert(res.matched === true, 'Test 1: "Open my projects." matches navigation intent');
  assert(res.actionType === 'scroll_section' && res.targetId === 'projects', 'Test 1: Routes to "projects" section');
  assert(res.spokenResponse.includes("projects"), 'Test 1: Spoken response mentions projects');
}

// ACCEPTANCE TEST 2: "Show me my professional experience."
{
  const res = matchNavigationIntent("Show me my professional experience.");
  assert(res.matched === true, 'Test 2: "Show me my professional experience." matches navigation intent');
  assert(res.actionType === 'scroll_section' && res.targetId === 'experience', 'Test 2: Routes to "experience" section');
  assert(res.spokenResponse.includes("professional experience") || res.spokenResponse.includes("Tex Web"), 'Test 2: Spoken response mentions professional experience');
}

// ACCEPTANCE TEST 3: "Take me to my education."
{
  const res = matchNavigationIntent("Take me to my education.");
  assert(res.matched === true, 'Test 3: "Take me to my education." matches navigation intent');
  assert(res.actionType === 'scroll_section' && res.targetId === 'education', 'Test 3: Routes to "education" section');
  assert(res.spokenResponse.includes("Sam Global University") || res.spokenResponse.includes("academic"), 'Test 3: Spoken response mentions academic credentials');
}

// ACCEPTANCE TEST 4: "Open my resume."
{
  const res = matchNavigationIntent("Open my resume.");
  assert(res.matched === true, 'Test 4: "Open my resume." matches navigation intent');
  assert(res.actionType === 'open_resume', 'Test 4: Action type is open_resume');
  assert(res.spokenResponse.includes("resume"), 'Test 4: Spoken response confirms opening resume');
}

// ACCEPTANCE TEST 5: "Show me my best AI project."
{
  const res = matchNavigationIntent("Show me my best AI project.");
  assert(res.matched === true, 'Test 5: "Show me my best AI project." matches navigation intent');
  assert(res.actionType === 'open_project' && res.projectSlug === 'customer-support-ai', 'Test 5: Opens featured customer-support-ai modal');
  assert(res.spokenResponse.includes("Customer Support"), 'Test 5: Spoken response confirms Customer Support Conversational AI');
}

// ACCEPTANCE TEST 6: "Go back to the homepage."
{
  const res = matchNavigationIntent("Go back to the homepage.");
  assert(res.matched === true, 'Test 6: "Go back to the homepage." matches navigation intent');
  assert(res.actionType === 'scroll_section' && res.targetId === 'hero', 'Test 6: Routes to hero/homepage section');
  assert(res.spokenResponse.includes("homepage"), 'Test 6: Spoken response confirms return to homepage');
}

// ACCEPTANCE TEST 7: "Tell me about Nagendra."
{
  const res = matchNavigationIntent("Tell me about Nagendra.");
  assert(res.matched === true, 'Test 7: "Tell me about Nagendra." matches navigation intent');
  assert(res.actionType === 'scroll_section' && res.targetId === 'about', 'Test 7: Routes to about section');
  assert(res.spokenResponse.includes("Nagendra Kushwaha"), 'Test 7: Spoken response provides introduction');
}

// HINDI VARIATION 1: "प्रोजेक्ट्स दिखाओ"
{
  const res = matchNavigationIntent("प्रोजेक्ट्स दिखाओ");
  assert(res.matched === true, 'Hindi Test 1: "प्रोजेक्ट्स दिखाओ" matches projects section');
  assert(res.targetId === 'projects', 'Hindi Test 1: Target is projects');
}

// HINDI VARIATION 2: "अनुभव दिखाओ"
{
  const res = matchNavigationIntent("अनुभव दिखाओ");
  assert(res.matched === true, 'Hindi Test 2: "अनुभव दिखाओ" matches experience section');
  assert(res.targetId === 'experience', 'Hindi Test 2: Target is experience');
}

// HINDI VARIATION 3: "रिज्यूमे खोलो"
{
  const res = matchNavigationIntent("रिज्यूमे खोलो");
  assert(res.matched === true, 'Hindi Test 3: "रिज्यूमे खोलो" matches resume action');
  assert(res.actionType === 'open_resume', 'Hindi Test 3: Action is open_resume');
}

// NON-NAVIGATION QUERY: "Why is accuracy misleading in fraud detection?"
{
  const res = matchNavigationIntent("Why is accuracy misleading in fraud detection?");
  assert(res.matched === false, 'Conversational query is NOT intercepted as a navigation command');
}

console.log(`\n====================================================`);
console.log(`NAVIGATION TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
console.log(`====================================================`);

if (failed > 0) {
  process.exit(1);
}

