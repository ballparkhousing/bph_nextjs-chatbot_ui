export const promptQuestion = {
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
              YES: "student_or_worker",
              NO: "student_or_worker",
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
            options: ["UOFA", "MACEWAN UNIVERSITY"],
            next: {
              default: "single_or_family",
            },
          },
          {
            id: "where_do_you_work",
            question: "WHERE DO YOU WORK?",
            options: ["ROGERS PLACE", "CWB"],
            next: {
              default: "single_or_family",
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
            id: "what_to_build",
            question: "WHAT DO YOU WANT TO BUILD?",
            options: ["RESIDENTIAL", "COMMERCIAL", "INDUSTRIAL"],
            next: {
              RESIDENTIAL: "kind_of_residential",
            },
          },
          {
            id: "kind_of_residential",
            question: "WHAT KIND OF RESIDENTIAL BUILDING?",
            options: [
              "SINGLE FAMILY - ATTACHED OR SEMI-DETACHED",
              "DUPLEX",
              "ROW HOUSES",
              "APARTMENTS",
            ],
            next: {
              "SINGLE FAMILY - ATTACHED OR SEMI-DETACHED": "where_to_build",
              DUPLEX: "where_to_build",
              "ROW HOUSES": "where_to_build",
              APARTMENTS: "apartment_type",
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
            options: ["CITY INFILL", "SUBURBS"],
          },
        ],
      },
    ],
  },
};
