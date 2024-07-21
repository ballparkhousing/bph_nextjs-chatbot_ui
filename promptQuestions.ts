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
            id: "new_to_canada",
            question: "ARE YOU NEW TO CANADA?",
            options: ["YES", "NO"],
            next: {
              default: "single_or_family"
            },
          },

          {
            id: "single_or_family",
            question: "ARE YOU SINGLE OR DO YOU HAVE A FAMILY?",
            options: ["SINGLE", "FAMILY"],
            next: {
              SINGLE: "do_you_want_a_roommate",
              FAMILY: "family_members",
            },
          },
          
          {
            id: "family_members",
            question: "HOW MANY FAMILY MEMBERS INCLUDING YOU?",
            options: ["2", "3", "5"],
            next: {
              default: "younger_than_5",
            },
          },
          {
            id: "younger_than_5",
            question: "DO YOU HAVE ANY FAMILY MEMBER YOUNGER THAN 5YRS OF AGE?",
            options: ["YES", "NO"],
            next: {
              default: "monthly_budget",
            },
          },
          {
            id: "do_you_want_a_roommate",
            question: "DO YOU WANT A ROOMMATE?",
            options: ["YES", "NO"],
            next: {
              default: "monthly_budget",
            },
          },

          {
            id: "monthly_budget",
            question: "WHAT IS YOUR MONTHLY BUDGET?",
            options: ["<$500", "<$1,000", "<$1,500", ">$2,000"],
            next: {
              default: "student_or_worker",
            },
          },

          {
            id: "student_or_worker",
            question: "ARE YOU A STUDENT OR A WORKER?",
            options: ["STUDENT", "WORKER"],
            next: {
              STUDENT: "what_school",
              WORKER: "where_do_you_work",
            },
          },
          {
            id: "what_school",
            question: "WHAT SCHOOL?",
            options: ["UOFA", "MACEWAN_UNIVERSITY"],
            next: {
              UOFA: "where_to_live_uofa",
              MACEWAN_UNIVERSITY : "where_to_live_mac"
            },
          },
          {
            id: "where_do_you_work",
            question: "WHERE DO YOU WORK?",
            options: ["ROGERS_PLACE", "CWB"],
            next: {
              ROGERS_PLACE: "where_to_live_work_rogers",
              CWB: "where_to_live_work_cwb"
            },
          },
          
          { id: "where_to_live_uofa",
            question: "WHERE DO YOU WANT TO LIVE?",
            options: ["UNIVERSITY_UOFA", "DOWNTOWN", "SOUTHSIDE"],
            next: {
              default: "map",
            },

          },
          { id: "where_to_live_mac",
            question: "WHERE DO YOU WANT TO LIVE?",
            options: ["UNIVERSITY_MACEWAN", "DOWNTOWN", "SOUTHSIDE"],
            next: {
              default: "map",
            },

          },

          { id: "where_to_live_work_rogers",
            question: "WHERE DO YOU WANT TO LIVE?",
            options: ["ROGERS_AREA", "DOWNTOWN", "SOUTHSIDE"],
            next: {
              default: "map",
            },

          },
          { id: "where_to_live_work_cwb",
            question: "WHERE DO YOU WANT TO LIVE?",
            options: ["CWB_AREA", "DOWNTOWN", "SOUTHSIDE"],
            next: {
              default: "map",
            },

          }

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
            id: "what_to_build",
            question: "WHAT DO YOU WANT TO BUILD?",
            options: ["RESIDENTIAL", "COMMERCIAL", "INDUSTRIAL"],
            next: {
              default: "kind_of_residential",
            },
          },
          {
            id: "kind_of_residential",
            question: "WHAT KIND OF BUILDING?",
            options: ["ATTACHED_OR_SEMI_DETACHED","APARTMENTS"],
            next: {
              ATTACHED_OR_SEMI_DETACHED: "what_type",
              APARTMENTS: "apartment_type",
            },
          },
          {
            id: "what_type",
            question: "DUPLEX OR ROW HOUSES?",
            options: ["DUPLEX", "ROW HOUSES"],
            next: {
              default: "where_to_build",
            },
          },
          {
            id: "apartment_type",
            question: "LOW, MEDIUM, HIGH?",
            options: ["LOW", "MEDIUM", "HIGH"],
            next: {
              default: "where_to_build",
            },
          },
          {
            id: "where_to_build",
            question: "WHERE DO YOU WANT TO BUILD?",
            options: ["CITY_INFILL", "SUBURBS"],
            next: {
              default: "map",
            },
          }
        ],
      },
    ],
  },
};
