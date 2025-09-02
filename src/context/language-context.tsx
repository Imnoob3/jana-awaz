
'use client';

import { createContext, useContext, useState, ReactNode, useMemo } from 'react';

const translations = {
  en: {
    "header": {
      "fileReport": "File a Report",
      "viewGrievances": "Recent Grievances",
      "trackSubmission": "Track Submission"
    },
    "home": {
      "title": "Jana Awaz: Your Voice for Justice",
      "subtitle": "Anonymously report crimes and corruption in Nepal. Your identity is always protected. Together, we can build a more accountable and transparent society.",
      "fileReport": "File a National Report",
      "voiceGrievance": "Voice a Grievance",
      "viewReports": "View Public Reports",
      "trackSubmission": "Track a Submission",
      "transparentNepal": {
        "title": "A Transparent & Accountable Nepal",
        "description": "Jana Awaz provides a secure and anonymous platform for citizens to expose wrongdoing, ensuring that every voice is heard and every report is taken seriously.",
        "reportsSubmitted": "Reports Submitted",
        "casesActioned": "Cases Actioned"
      },
      "howItWorks": {
        "title": "How It Works",
        "description": "Our platform ensures your report reaches the correct authorities without revealing who you are.",
        "step1": {
          "title": "1. Submit Your Report",
          "description": "Fill out a simple, anonymous form with details of the incident and upload a photo as evidence."
        },
        "step2": {
          "title": "2. AI-Powered Routing",
          "description": "Our intelligent system analyzes your report and automatically forwards it to the appropriate body—the CIAA for official corruption or the Police for other crimes."
        },
        "step3": {
          "title": "3. Public Transparency",
          "description": "Submitted reports are made public to ensure transparency and accountability, driving systemic change."
        }
      },
      "iccSection": {
        "title": "International Accountability",
        "description": "For crimes of severe magnitude, such as those involving the entire top level of government or situations beyond national capacity to handle, reports and evidence will be securely escalated and directly submitted to the International Criminal Court (ICC) to ensure justice is pursued without boundaries.",
        "warning": "Warning: Submitting a report to the ICC is a serious action. If a report is found to be submitted with mischievous intent, you may be identified through hardware tracking and could face criminal charges. This tracking only applies to ICC submissions.",
        "reportButton": "Report Directly to ICC"
      }
    },
    "reportForm": {
      "title": "File an Anonymous Report",
      "description": "Your identity is protected. Please provide as much detail as possible. A photo is required.",
      "crimeType": "Type of Crime",
      "specificCrimeType": "Specific Type of Crime",
      "governmentCrime": {
        "title": "Government Crime",
        "description": "e.g., corruption, abuse of authority"
      },
      "civilianCrime": {
        "title": "Civilian Crime",
        "description": "e.g., theft, assault, property damage"
      },
      "district": "District",
      "selectDistrict": "Select a district",
      "localAddress": "Local Address / Tole",
      "localAddressPlaceholder": "e.g., Ward No. 5, Near the old temple",
      "reportDetails": "Report Details",
      "reportDetailsPlaceholder": "Describe the incident: who was involved, what happened, where, and when.",
      "uploadEvidence": "Upload Photo Evidence",
      "removePhoto": "Remove photo",
      "uploadPhotoAriaLabel": "Upload photo",
      "clickToUpload": "Click to upload",
      "dragAndDrop": "or drag and drop",
      "fileTypes": "PNG, JPG up to 4MB",
      "submitting": "Submitting...",
      "submitAnonymously": "Submit Report Anonymously"
    },
     "crimeSubTypes": {
      "bribery": "Bribery",
      "embezzlement": "Embezzlement",
      "nepotism": "Nepotism",
      "abuseofauthority": "Abuse of Authority",
      "theft": "Theft",
      "assault": "Assault",
      "vandalism": "Vandalism",
      "fraud": "Fraud",
      "other": "Other"
    },
    "iccReportForm": {
      "title": "Submit a Report to the ICC",
      "description": "This form is for reporting severe crimes that fall under the jurisdiction of the International Criminal Court. All submissions are treated with the utmost seriousness.",
      "warningTitle": "Legal Warning",
      "warningDescription": "Submitting a report to the ICC is a formal legal action. If a report is found to be submitted with mischievous or malicious intent, you consent to be identified through hardware and network analysis, and you may face severe criminal charges. Do not proceed unless your report is genuine.",
      "agreeWarning": "I have read and understood the warning and wish to proceed."
    },
    "reportsPage": {
      "title": "Browse Reports",
      "description": "Explore anonymous reports submitted by citizens. Reports are automatically routed to the appropriate agency for action.",
      "ciaaReports": "CIAA Reports",
      "policeReports": "Police Reports",
      "iccReports": "ICC Reports",
      "grievances": "Grievances",
      "ciaaDescription": "Reports concerning government officials and corruption, routed to the Commission for the Investigation of Abuse of Authority (CIAA).",
      "policeDescription": "Reports concerning civilian-related crimes, routed to the Nepal Police.",
      "iccDescription": "Reports concerning severe crimes escalated to the International Criminal Court (ICC).",
      "grievancesDescription": "Public grievances concerning rules, governance, or social issues."
    },
    "reportsList": {
      "searchPlaceholder": "Search by keywords in reports...",
      "noReportsFound": "No Reports Found",
      "noReportsMatched": "No reports matched your search criteria."
    },
    "reportCard": {
      "evidenceAlt": "Crime scene evidence",
      "aiAnalysis": "AI Routing Analysis"
    },
    "confirmation": {
      "title": "Submission Successful!",
      "description": "Your submission has been received and routed to the {recipient}. Thank you for your contribution.",
      "saveId": "Please save your tracking ID. This ID will not be shown again.",
      "trackingId": "Your Tracking ID",
      "trackButton": "Track Status",
      "backToHome": "Back to Home"
    },
    "track": {
        "title": "Track Your Submission",
        "description": "Enter the tracking ID you received after submitting your report or grievance to check its current status.",
        "trackingIdLabel": "Tracking ID",
        "placeholder": "Enter your tracking ID...",
        "trackButton": "Track Submission",
        "notFound": {
            "title": "Submission Not Found",
            "description": "We couldn't find a submission with that ID. Please check the ID and try again.",
            "button": "Try Again"
        },
        "details": {
            "reportTitle": "Report Details",
            "grievanceTitle": "Grievance Details",
            "evidenceAlt": "Evidence photo"
        },
        "status": {
            "title": "Current Status",
            "description": "This timeline shows the progress of your submission. Updates will appear here as they happen."
        }
    },
    "timeline": {
        "submitted": {
            "title": "Submitted",
            "description": "Your submission has been successfully received by our system."
        },
        "inReview": {
            "title": "Under Review",
            "description": "The appropriate authorities are currently reviewing your submission."
        },
        "actionTaken": {
            "title": "Action Taken",
            "description": "Initial action or investigation has been initiated based on your submission."
        },
        "resolved": {
            "title": "Resolved",
            "description": "The case has been resolved or closed. Thank you for your contribution."
        }
    },
    "toast": {
      "submissionError": {
        "title": "Submission Error"
      },
      "fileTooLarge": {
        "title": "File too large",
        "description": "Please upload an image smaller than 4MB."
      },
      "error": "Error"
    }
  },
  ne: {
    "header": {
      "fileReport": "उजुरी दर्ता गर्नुहोस्",
      "viewReports": "उजुरीहरू हेर्नुहोस्",
      "trackSubmission": "उजुरीको स्थिति हेर्नुहोस्"
    },
    "home": {
      "title": "जन आवाज: न्यायको लागि तपाईंको आवाज",
      "subtitle": "नेपालमा अपराध र भ्रष्टाचारको गुमनाम रूपमा रिपोर्ट गर्नुहोस्। तपाईंको पहिचान सधैं सुरक्षित रहन्छ। सँगै, हामी एक थप जवाफदेही र पारदर्शी समाज निर्माण गर्न सक्छौं।",
      "fileReport": "राष्ट्रिय उजुरी दर्ता गर्नुहोस्",
      "voiceGrievance": "गुनासो व्यक्त गर्नुहोस्",
      "viewReports": "सार्वजनिक उजुरीहरू हेर्नुहोस्",
      "trackSubmission": "उजुरीको स्थिति हेर्नुहोस्",
      "transparentNepal": {
        "title": "एक पारदर्शी र जवाफदेही नेपाल",
        "description": "जन आवाजले नागरिकहरूलाई गलत कामको पर्दाफास गर्न एक सुरक्षित र गुमनाम प्लेटफर्म प्रदान गर्दछ, प्रत्येक आवाज सुनिएको र हरेक उजुरीलाई गम्भीरतापूर्वक लिइने सुनिश्चित गर्दछ।",
        "reportsSubmitted": "दर्ता भएका उजुरीहरू",
        "casesActioned": "कारबाही भएका केसहरू"
      },
      "howItWorks": {
        "title": "यसले कसरी काम गर्छ",
        "description": "हाम्रो प्लेटफर्मले तपाईंको उजुरी तपाईंको पहिचान नखुलाईकन सही अधिकारीहरूसम्म पुग्ने सुनिश्चित गर्दछ।",
        "step1": {
          "title": "१. आफ्नो उजुरी दर्ता गर्नुहोस्",
          "description": "घटनाको विवरणसहित एउटा सरल, गुमनाम फारम भर्नुहोस् र प्रमाणको रूपमा फोटो अपलोड गर्नुहोस्।"
        },
        "step2": {
          "title": "२. एआई-द्वारा रूटिङ",
          "description": "हाम्रो बौद्धिक प्रणालीले तपाईंको उजुरीको विश्लेषण गर्दछ र यसलाई स्वचालित रूपमा उपयुक्त निकायमा पठाउँछ—सरकारी भ्रष्टाचारको लागि अख्तियार दुरुपयोग अनुसन्धान आयोग (CIAA) वा अन्य अपराधहरूको लागि प्रहरी।"
        },
        "step3": {
          "title": "३. सार्वजनिक पारदर्शिता",
          "description": "दर्ता गरिएका उजुरीहरू पारदर्शिता र जवाफदेहीता सुनिश्चित गर्न सार्वजनिक गरिन्छ, जसले प्रणालीगत परिवर्तनलाई अगाडि बढाउँछ।"
        }
      },
      "iccSection": {
        "title": "अन्तर्राष्ट्रिय जवाफदेहिता",
        "description": "गम्भीर प्रकृतिका अपराधहरू, जस्तै सरकारको सम्पूर्ण उच्च तह संलग्न भएका वा राष्ट्रिय क्षमताभन्दा बाहिरका परिस्थितिहरूका लागि, रिपोर्ट र प्रमाणहरू सुरक्षित रूपमा अन्तर्राष्ट्रिय फौजदारी अदालत (ICC) मा सिधै पेस गरिनेछ ताकि न्याय सीमाविहीन रूपमा सुनिश्चित होस्।",
        "warning": "चेतावनी: ICC मा उजुरी पेस गर्नु एक गम्भीर कार्य हो। यदि कुनै उजुरी द्वेषपूर्ण मनसायले पेस गरिएको पाइएमा, तपाईंलाई हार्डवेयर ट्र्याकिङमार्फत पहिचान गरी फौजदारी कारबाहीको सामना गर्नुपर्ने हुन सक्छ। यो ट्र्याकिङ ICC मा गरिएका उजुरीहरूमा मात्र लागू हुन्छ।",
        "reportButton": "ICC मा सिधै रिपोर्ट गर्नुहोस्"
      }
    },
    "reportForm": {
      "title": "गुमनाम उजुरी दर्ता गर्नुहोस्",
      "description": "तपाईंको पहिचान सुरक्षित छ। कृपया सकेसम्म धेरै विवरण प्रदान गर्नुहोस्। फोटो अनिवार्य छ।",
      "crimeType": "अपराधको प्रकार",
      "specificCrimeType": "अपराधको विशिष्ट प्रकार",
      "governmentCrime": {
        "title": "सरकारी अपराध",
        "description": "उदाहरण: भ्रष्टाचार, अख्तियारको दुरुपयोग"
      },
      "civilianCrime": {
        "title": "नागरिक अपराध",
        "description": "उदाहरण: चोरी, हमला, सम्पत्ति क्षति"
      },
      "district": "जिल्ला",
      "selectDistrict": "जिल्ला छान्नुहोस्",
      "localAddress": "स्थानीय ठेगाना / टोल",
      "localAddressPlaceholder": "उदाहरण: वडा नं. ५, पुरानो मन्दिर नजिक",
      "reportDetails": "उजुरीको विवरण",
      "reportDetailsPlaceholder": "घटनाको वर्णन गर्नुहोस्: को संलग्न थियो, के भयो, कहाँ, र कहिले।",
      "uploadEvidence": "फोटो प्रमाण अपलोड गर्नुहोस्",
      "removePhoto": "फोटो हटाउनुहोस्",
      "uploadPhotoAriaLabel": "फोटो अपलोड गर्नुहोस्",
      "clickToUpload": "अपलोड गर्न क्लिक गर्नुहोस्",
      "dragAndDrop": "वा ड्र्याग एण्ड ड्रप गर्नुहोस्",
      "fileTypes": "PNG, JPG ४MB सम्म",
      "submitting": "दर्ता हुँदैछ...",
      "submitAnonymously": "गुमनाम रूपमा उजुरी दर्ता गर्नुहोस्"
    },
    "crimeSubTypes": {
      "bribery": "घुसखोरी",
      "embezzlement": "हिनामिना",
      "nepotism": "नातावाद",
      "abuseofauthority": "अख्तियारको दुरुपयोग",
      "theft": "चोरी",
      "assault": "हमला",
      "vandalism": "तोडफोड",
      "fraud": "छल",
      "other": "अन्य"
    },
    "iccReportForm": {
        "title": "ICC मा उजुरी दर्ता गर्नुहोस्",
        "description": "यो फारम अन्तर्राष्ट्रिय फौजदारी अदालतको अधिकार क्षेत्रभित्र पर्ने गम्भीर अपराधहरूको रिपोर्ट गर्नको लागि हो। सबै सबमिशनहरूलाई अत्यन्त गम्भीरताका साथ व्यवहार गरिन्छ।",
        "warningTitle": "कानूनी चेतावनी",
        "warningDescription": "ICC मा उजुरी पेस गर्नु एक औपचारिक कानूनी कारबाही हो। यदि कुनै उजुरी द्वेषपूर्ण वा खराब नियतले पेस गरिएको पाइएमा, तपाईं हार्डवेयर र नेटवर्क विश्लेषणमार्फत पहिचान हुन सहमत हुनुहुन्छ, र तपाईंले गम्भीर फौजदारी कारबाहीको सामना गर्नुपर्ने हुन सक्छ। तपाईंको उजुरी वास्तविक नभएसम्म अगाडि नबढ्नुहोस्।",
        "agreeWarning": "मैले चेतावनी पढेको छु र बुझेको छु र अगाडि बढ्न चाहन्छु।"
    },
    "reportsPage": {
      "title": "उजुरीहरू ब्राउज गर्नुहोस्",
      "description": "नागरिकहरूद्वारा पेश गरिएका गुमनाम उजुरीहरू अन्वेषण गर्नुहोस्। उजुरीहरू स्वचालित रूपमा कारबाहीको लागि उपयुक्त एजेन्सीमा पठाइन्छ।",
      "ciaaReports": "CIAA उजुरीहरू",
      "policeReports": "प्रहरी उजुरीहरू",
      "iccReports": "ICC उजुरीहरू",
      "grievances": "गुनासोहरू",
      "ciaaDescription": "सरकारी अधिकारीहरू र भ्रष्टाचार सम्बन्धी उजुरीहरू, अख्तियार दुरुपयोग अनुसन्धान आयोग (CIAA) लाई पठाइएको।",
      "policeDescription": "नागरिक सम्बन्धी अपराधहरू सम्बन्धी उजुरीहरू, नेपाल प्रहरीलाई पठाइएको।",
      "iccDescription": "अन्तर्राष्ट्रिय फौजदारी अदालत (ICC) मा पठाइएका गम्भीर अपराधहरू सम्बन्धी उजुरीहरू।",
      "grievancesDescription": "नियम, शासन, वा सामाजिक मुद्दाहरू सम्बन्धी सार्वजनिक गुनासोहरू।"
    },
    "reportsList": {
      "searchPlaceholder": "उजुरीहरूमा किवर्डहरूद्वारा खोज्नुहोस्...",
      "noReportsFound": "कुनै उजुरी फेला परेन",
      "noReportsMatched": "तपाईंको खोज मापदण्डसँग कुनै उजुरी मेल खाएन।"
    },
    "reportCard": {
      "evidenceAlt": "अपराध स्थलको प्रमाण",
      "aiAnalysis": "एआई रूटिङ विश्लेषण"
    },
    "confirmation": {
      "title": "उजुरी सफलतापूर्वक दर्ता भयो!",
      "description": "तपाईंको उजुरी प्राप्त भयो र {recipient} लाई पठाइएको छ। तपाईंको योगदानको लागि धन्यवाद।",
      "saveId": "कृपया आफ्नो ट्र्याकिङ आईडी सुरक्षित राख्नुहोस्। यो आईडी फेरि देखाइने छैन।",
      "trackingId": "तपाईंको ट्र्याकिङ आईडी",
      "trackButton": "स्थिति हेर्नुहोस्",
      "backToHome": "गृह पृष्ठमा फर्कनुहोस्"
    },
    "track": {
        "title": "आफ्नो उजुरीको स्थिति हेर्नुहोस्",
        "description": "आफ्नो उजुरी वा गुनासोको हालको स्थिति जाँच गर्न तपाईंले प्राप्त गर्नुभएको ट्र्याकिङ आईडी प्रविष्ट गर्नुहोस्।",
        "trackingIdLabel": "ट्र्याकिङ आईडी",
        "placeholder": "आफ्नो ट्र्याकिङ आईडी प्रविष्ट गर्नुहोस्...",
        "trackButton": "उजुरीको स्थिति हेर्नुहोस्",
        "notFound": {
            "title": "उजुरी फेला परेन",
            "description": "यो आईडी भएको कुनै उजुरी फेला परेन। कृपया आईडी जाँच गरी फेरि प्रयास गर्नुहोस्।",
            "button": "फेरि प्रयास गर्नुहोस्"
        },
        "details": {
            "reportTitle": "उजुरीको विवरण",
            "grievanceTitle": "गुनासोको विवरण",
            "evidenceAlt": "प्रमाणको फोटो"
        },
        "status": {
            "title": "हालको स्थिति",
            "description": "यो टाइमलाइनले तपाईंको उजुरीको प्रगति देखाउँछ। अद्यावधिकहरू यहाँ देखा पर्नेछन्।"
        }
    },
     "timeline": {
        "submitted": {
            "title": "दर्ता भयो",
            "description": "तपाईंको उजुरी हाम्रो प्रणालीमा सफलतापूर्वक प्राप्त भयो।"
        },
        "inReview": {
            "title": "समीक्षामा",
            "description": "सम्बन्धित अधिकारीहरूले हाल तपाईंको उजुरीको समीक्षा गरिरहेका छन्।"
        },
        "actionTaken": {
            "title": "कारबाही सुरु भयो",
            "description": "तपाईंको उजुरीको आधारमा प्रारम्भिक कारबाही वा अनुसन्धान सुरु गरिएको छ।"
        },
        "resolved": {
            "title": "समाधान भयो",
            "description": "यो केस समाधान वा बन्द गरिएको छ। तपाईंको योगदानको लागि धन्यवाद।"
        }
    },
    "toast": {
      "submissionError": {
        "title": "दर्तामा त्रुटि"
      },
      "fileTooLarge": {
        "title": "फाइल धेरै ठूलो भयो",
        "description": "कृपया ४MB भन्दा सानो छवि अपलोड गर्नुहोस्।"
      },
      "error": "त्रुटि"
    }
  }
}

type Language = 'en' | 'ne';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  translations: any;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const value = useMemo(() => ({
    language,
    setLanguage,
    translations: translations[language],
  }), [language]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
