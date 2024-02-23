import { Paragraph, HeadingLevel, PageBreak, SectionProperties, PageOrientation, TextRun, AlignmentType } from "docx";

import { spacer, PAGE_HEADER, SPACE_BETWEEN, JUDGES_INFO } from "./defaultUtilBlocks";

import { TABLE_PERSONAL_ZALIK_100_RESULTS } from "./tables/PERSONAL_100_RESULTS_ZALIK";
import { TABLE_PERSONAL_DUELING_RESULTS } from "./tables/PERSONAL_DUELING_RESULTS";
import { TABLE_START_PROTOCOL_RESULTS } from "./tables/START_PROTOCOL_RESULTS";
import { TABLE_PERSONAL_RESULTS_ZALIK } from "./tables/PERSONAL_RESULTS_ZALIK";
import { TABLE_TEAM_RELAY_RESULTS } from "./tables/TEAM_RELAY_RESULTS";
import { TABLE_TEAM_RESULTS } from "./tables/TEAM_RESULTS";
import { TABLE_TEAM_RESULTS_BY_TYPE } from "./tables/TEAM_RESULTS_BY_TYPE";
import { TABLE_TEAM_100_RESULTS } from "./tables/TEAM_100_RESULTS";
import {
  TABLE_PERSONAL_FINAL_RESULTS,
  TABLE_PERSONAL_HALFFINAL_RESULTS,
} from "./tables/PERSONAL_RESULTS";
import {
  TABLE_PERSONAL_FINAL_100_RESULTS,
  TABLE_PERSONAL_HALFFINAL_100_RESULTS,
} from "./tables/PERSONAL_100_RESULTS";

// assign table according to the type
const GIVE_TABLE_BY_TYPE = (type, tables) => {
  switch (type) {
    case "START_PROTOCOL":
      return TABLE_START_PROTOCOL_RESULTS(tables);
    case "TEAM_RESULTS":
      return TABLE_TEAM_RESULTS(tables);
    case "TEAM_RELAY_RESULTS":
      return TABLE_TEAM_RELAY_RESULTS(tables);
    case "TEAM_RESULTS_BY_TYPE":
      return TABLE_TEAM_RESULTS_BY_TYPE(tables);
    case "TEAM_100_RESULTS":
      return TABLE_TEAM_100_RESULTS(tables);
    case "DUELING_PERSONAL_RESULTS":
      return TABLE_PERSONAL_DUELING_RESULTS(tables);
    case "PERSONAL_RESULTS_FINAL":
      return TABLE_PERSONAL_FINAL_RESULTS(tables);
    case "PERSONAL_RESULTS_HALFFINAL":
      return TABLE_PERSONAL_HALFFINAL_RESULTS(tables);
    case "PERSONAL_RESULTS_ZALIK":
      return TABLE_PERSONAL_RESULTS_ZALIK(tables);
    case "PERSONAL_RESULTS_HALFFINAL_100":
      return TABLE_PERSONAL_HALFFINAL_100_RESULTS(tables);
    case "PERSONAL_RESULTS_FINAL_100":
      return TABLE_PERSONAL_FINAL_100_RESULTS(tables);
    case "PERSONAL_RESULTS_ZALIK_100":
      return TABLE_PERSONAL_ZALIK_100_RESULTS(tables);
    default:
      console.error(`Incorrect table type, ignoring it`, type);
      return [spacer];
  }
};

const setPageOrientation = () => {
  return new SectionProperties({
    type: {
      orientation: PageOrientation.LANDSCAPE,
    },
  });
};


// const setPageMargins = () => {
//   return new SectionProperties({
//     page: {
//       margin: {
//         top: 567,    // 1 cm in twentieths of a point
//         right: 454,  // 0.8 cm in twentieths of a point
//         bottom: 454, // 0.8 cm in twentieths of a point
//         left: 850,   // 1.5 cm in twentieths of a point
//       },
//     },
//   });
// };

export const DATA_TO_DOC_PAGES = (pages) => {
  return pages.reduce((acc, next, index) => {
    let mergedTable = [
      ...PAGE_HEADER(next.header),
      ...GIVE_TABLE_BY_TYPE(next.type, next.tables),
      ...JUDGES_INFO(next.judges),
    ];
    if (index !== pages.length - 1)
      mergedTable.push(new Paragraph({ children: [new PageBreak()] }));
    return [...acc, ...mergedTable];
  }, []);
};