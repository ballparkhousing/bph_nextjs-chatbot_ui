export interface Question {
  id: string;
  question: string;
  options: string[];
  next?: {
    [key: string]: string;
    default?: string | any;
  };
}

export interface Scenario {
  question: string;
  questions: Question[]
}

export interface PromptQuestion {
  [key: string]: {
    scenarios: Scenario[];
  };
}

export const promptQuestion: PromptQuestion = {
  renter: {
    scenarios: [
      {
        question: "I WANT TO RENT",
        questions: [
          {
            id: "pick_a_city",
            question: "CHOOSE A CITY",
            options: ["EDMONTON", "CALGARY"],
            next: {
              default: "new_to_canada"
            }
          },

          {
            id: "new_to_canada",
            question: "ARE YOU NEW TO CANADA?",
            options: ["YES", "NO"],
            next: {
              default: "renting_alone_with_family_or_roommates"
            },
          },

          {
            id: "renting_alone_with_family_or_roommates",
            question: "ARE YOU RENTING ALONE, WITH FAMILY OR WITH ROOMMATES?",
            options: ["ALONE", "WITH FAMILY", "WITH ROOMMATES"],
            next: {
              ALONE: "student_worker_or_freelancer",
              "WITH FAMILY": "family_members",
              "WITH ROOMMATES": "with_roommates",
            },
          },
          
          {
            id: "family_members",
            question: "HOW MANY FAMILY MEMBERS INCLUDING YOU?",
            options: ["2", "3", "5", "6 OR MORE"],
            next: {
              default: "younger_than_5",
            },
          },

          {
            id: "younger_than_5",
            question: "DO YOU HAVE ANY FAMILY MEMBER YOUNGER THAN 5YEARS OF AGE?",
            options: ["YES", "NO"],
            next: {
              default: "student_worker_or_freelancer",
            },
          },

          {
            id: "with_roommates",
            question: "HOW MANY ROOMMATES INCLUDING YOU?",
            options: ["2", "3", "5 OR MORE"],
            next: {
              default: "student_worker_or_freelancer",
            },
          },

          {
            id: "student_worker_or_freelancer",
            question: "ARE YOU EMPLOYED, IN SCHOOL OR A FREELANCER?",
            options: ["EMPLOYED", "STUDENT", "FREELANCER"],
            next: {
              EMPLOYED: "where_do_you_work",
              STUDENT: "what_school",
              FREELANCER: "where_do_you_want_to_live",
            },
          },

          {
            id: "where_do_you_work",
            question: "WHERE DO YOU WORK?",
            options: ["Type in Response"],
            next: {
              default: "where_do_you_want_to_live"
            },
          },
          
          {
            id: "what_school",
            question: "WHAT SCHOOL?",
            options: ["UOFA", "MACEWAN UNIVERSITY"],
            next: {
              UOFA: "where_to_live_uofa",
              "MACEWAN UNIVERSITY" : "where_to_live_mac"
            },
          },

          { id: "where_to_live_uofa",
            question: "WHERE DO YOU WANT TO LIVE?",
            options: ["AROUND THE UOFA", "DOWNTOWN", "SOUTHSIDE"],
            next: {
              default: "monthly_budget",
            },

          },
          
          { id: "where_to_live_mac",
            question: "WHERE DO YOU WANT TO LIVE?",
            options: ["AROUND MACEWAN UNIVERSITY", "AROUND DOWNTOWN", "SOUTHSIDE"],
            next: {
              default: "monthly_budget",
            },

          },

          { id: "where_do_you_want_to_live",
            question: "WHICH NEIGHBOURHOOD DO YOU WANT TO LIVE IN?",
            options: ["Abbottsfield", "Alberta Avenue", "Argyll", "Aspen Gardens", "Athlone", "Avonmore", "Balwin", "Bellevue", "Belvedere", "Blatchford"," Bonnie Doon",
              "Calder", "Calgary", "Trail North", "Trail South", "Capilano", "Crestwood", "Cromdale", "Delton", "Delwood", "Dovercourt", "Duggan", "Eastwood", "Elmwood Park", 
              "Empire Park", "Forest Heights", "Fulton Place", "Glengarry", "Glenora", "Gold Bar", "Grandview Heights","Greenfield", "Grovenor", "Highlands", "Holyrood", "Idylwylde", "Inglewood",
              "Kenilworth", "Kensington", "Killarney", "King Edward Park", "Lansdowne", "Lauderdale", "Laurier Heights", "Lendrum Place", "Malmo Plains", "McQueen", "Montrose", "Newton", "North Glenora", "Ottewell",
              "Parkdale", "Parkview", "Patricia Heights", "Pleasantview", "Prince Charles","Prince Rupert", "Quesnell Heights", "Rideau Park", "Rosslyn", "Royal Gardens", "Rundle Heights", "Sherbrooke", "Spruce Avenue", "Strathcona", "Strathearn",
              "Terrace Heights", "University of Alberta Farm", "Virginia Park", "Wellington", "Westbrook Estates", "Westmount", "Westwood", "Woodcroft"],
            next: {
              default: "monthly_budget",
            },
          },

          {
            id: "monthly_budget",
            question: "WHAT IS YOUR BUDGET?",
            options: ["$500 - $999", "$1,000 - $1,999", "$2,000 - $2,999", "$3,000 AND ABOVE"],
            next: {
              default: "map",
            },
          },

        ],
      },
    ],
  },
  builder: {
    scenarios: [
      {
        question: "I WANT TO BUILD",
        questions: [
          {
            id: "pick_a_city",
            question: "CHOOSE A CITY",
            options: ["EDMONTON", "CALGARY"],
            next: {
              default: "what_is_your_budget"
            }
          },

          {
            id: "what_is_your_budget",
            question: "WHAT IS YOUR BUDGET?",
            options: ["$100,000 - $349,999", "$350,000 - $549,999", "$550,000 - $799,999", "$800,000 - $999,999", "$1,000,000  and Above"],
            next: 
            {
              default: "what_to_build",
            }
            },

          {
            id: "what_to_build",
            question: "WHAT DO YOU WANT TO BUILD?",
            options: ["RESIDENTIAL", "COMMERCIAL"],
            next: {
              RESIDENTIAL: "kind_of_residential",
              COMMERCIAL: "kind_of_commercial",
            },
          },

          {
            id: "kind_of_residential",
            question: "WHAT KIND OF RESIDENTIAL BUILDING?",
            options: ["SINGLE_FAMILY", "MULTI_FAMILY"],
            next: {
              SINGLE_FAMILY: "options_for_single_family",
              MULTI_FAMILY: "options_for_multi_family",
            },
          },

          {
            id: "options_for_single_family",
            question: "WHAT TYPE OF SINGLE-FAMILY BUILDING?",
            options: ["ATTACHED",  "SEMI-DETACHED",  "DUPLEX",  "ROW HOUSES"],
            next: {
              default: "where_to_build",
            },
          },

          {
            id: "options_for_multi_family",
            question: "WHAT TYPE OF MULTI-FAMILY BUILDING?",
            options: ["LOW-RISE", 	"MEDIUM-RISE", 	"HIGH-RISE"],
            next: {
              default: "where_to_build",
            },
          },

          {
            id: "kind_of_commercial",
            question: "WHAT TYPE OF COMMERCIAL BUILDING?",
            options: ["MIXED USE",  "RETAIL",  "OFFICE",  "HOSPITALITY", "INDUSTRIAL"],
            next: {
              "MIXED USE": "where_to_build",
              OFFICE: "where_to_build",
              RETAIL: "where_to_build",
              HOSPITALITY: "where_to_build",
              INDUSTRIAL: "kind_of_industrial",
            },
          },
          
          {
            id: "kind_of_industrial",
            question: "WHAT KIND OF INDUSTRIAL?",
            options: ["LIGHT", "HEAVY"],
            next: {
              default: "where_to_build",
            },
          },

          {
            id: "where_to_build",
            question: "WHERE DO YOU WANT TO BUILD?",
            options: ["CITY INFILL", "SUBURBS", "RURAL"],
            next: {
              default: "access_to_financing",
            },
          },

          {
            id: "access_to_financing",
            question: "DO YOU HAVE ACCESS TO FINANCING?",
            options: ["YES", "NO"],
            next: {
              YES: "loan_to_value_ratio",
              NO: "access_our_finance_partners",
            },
          },

          {
            id: "loan_to_value_ratio",
            question: "WHAT IS YOUR LOAN-TO-VALUE RATIO?",
            options: ["Type in Response"],
            next: {
              default: "map",
            },
          },
          
          {
            id: "access_our_finance_partners",
            question: "ACCESS FINANCING FROM OUR PARTNERS",
            options: ["ICI", "CMHC"],
            next: {
              default: "map",
            },
          },
          
        ],
      },
    ],
  },
};
