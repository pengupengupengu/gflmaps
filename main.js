(function(){

var config = {
  langCode: "en",
  dataSource: "cn",
  shouldLoadChibis: true,
};

let loadedImageAssets = {};

// TODO add TC, KR, JP
var fontList = "Noto Sans, Noto Sans SC, Arial";

var data;

var Enemy_team, Enemy_team_map;
var Enemy_in_team, Enemy_in_team_by_team_id;
var Enemy_standard_attribute;
var Spot;
var Theater_area;

var Mission, Mission_map;
var Enemy_charater_type, Enemy_character_type_by_id;
var Ally_team;
var Gun, Gun_by_id;
var Gun_in_ally;
var Sangvis_in_ally;
var equip_in_ally_info;
var trial_info;
var Building, BuildingMap;
var Team_ai;
var Mission_targettrain_enemy;

var Mission_txt, Mission_cn_txt;
var Enemy_charater_type_txt, Enemy_charater_type_cn_txt;
var Ally_team_txt, Ally_team_cn_txt;
var Building_txt, Building_cn_txt;
var Equip_txt, Equip_cn_txt;
var Gun_txt, Gun_cn_txt;
var Sangvis_txt, Sangvis_cn_txt;
var Team_ai_txt;
var Mission_targettrain_enemy_txt, Mission_targettrain_enemy_cn_txt;
var Special_spot_config_txt;

var UI_TEXT = {};
var INSTRUCTIONS = "";

const spotPaths = [
  "random_belong0.png",
  "random_belong1.png",
  "random_belong2.png",
  "random_belong3.png",
  "spot1_belong1.png",
  "spot1_belong0.png",
  "spot1_belong2.png",
  "spot1_belong3.png",
  "spot2_belong0.png",
  "spot2_belong1.png",
  "spot2_belong2.png",
  "spot2_belong3.png",
  "spot3_belong0.png",
  "spot3_belong0_closed.png",
  "spot3_belong1.png",
  "spot3_belong1_closed.png",
  "spot3_belong2.png",
  "spot3_belong2_closed.png",
  "spot3_belong3.png",
  "spot3_belong3_closed.png",
  "spot4_belong0.png",
  "spot4_belong1.png",
  "spot4_belong2.png",
  "spot4_belong3.png",
  "spot5_belong0.png",
  "spot5_belong1.png",
  "spot5_belong2.png",
  "spot5_belong3.png",
  "spot6_belong0.png",
  "spot6_belong1.png",
  "spot6_belong2.png",
  "spot6_belong3.png",
  "spot7_belong0.png",
  "spot7_belong0_closed.png",
  "spot7_belong1.png",
  "spot7_belong1_closed.png",
  "spot7_belong2.png",
  "spot7_belong2_closed.png",
  "spot7_belong3.png",
  "spot7_belong3_closed.png",
  "spot8_belong0.png",
  "spot8_belong1.png",
  "spot8_belong2.png",
  "spot8_belong3.png",
];

// As of DR/Division/MS (up to client 2.07), if an allied team is controllable,
// then its "ai" field's second part looks like "2010" or "2001:4,8".
// Each digit after the initial "2" can be "0" or "1", and indicates a separate
// attribute about the team. The digits are:
//   * The second digit indicates whether or not the allied team can be retreated.
//     No controllable allied team in DR/Division/MS has this set to true.
//   * The third digit indicates whether or not the allied team can be repaired.
//   * The fourth digit indicates whether or not the allied team can be resupplied.
//     If this is set to zero, then the allied team has infinite ammo/MRE.
//     If this is set to one, then there are two numbers after this digit and a colon.
//     Those two numbers are the ammo count (out of 5) and MRE count (out of 10).
const controllableAllyTeamRegex = /2([01])([01])(0|1:(\d+),(\d+))/;

let missionIdToSuspectedSpawns = {};
let theaterAreaToLevelAdjustments = {};
let defDrillTeamsToLevels = {};

const wellKnownEnemyCodes = new Set([
  "Punish",
  "Visjnoe",
  "Cherub",
  "Obelisk_partB",
  "Obelisk_partA",
  "Riotguard",
  "Metalmax",
  //"Executioner",
  //"Grenadier",
  "Mastersergeant",
  "Nyto_Black_SMG",
  "Nyto_Black_Hammer",
  "Nyto_Black_RF",
  "Nyto_White_Commander",
  "Cerberus_White",
  "Teal",
]);

// CHANGES FROM GFWIKI: For most data, if the asset text file does not contain a name or the name is blank,
//     then just use the table ID (i.e. "[mission-10000125]" for 13-1). This is so that names don't appear blank
//     when using dataSource=CN and langCode=EN.
function trans() {
  for (i in Building) {
    var namepos = Building_txt.indexOf(Building[i].name);
    var namestr = namepos !== -1 ? Building_txt.slice(namepos + Building[i].name.length + 1, Building_txt.indexOf("\n", namepos) - 1).trim().replace("//c", UI_TEXT["comma"]) : null;
    if (namestr && !namestr.match(/(?:don't|do not) translate/i)) {
      Building[i].name = namestr;
    } else {
      const fallback_match = Building_cn_txt.match(`${Building[i].name},(.*)`);
      Building[i].name = fallback_match ? `[${Building[i].code}] ${fallback_match[1]}` : `[${Building[i].code}]`;
    }
  }

  for (i in Mission) {
    var namepos = Mission_txt.indexOf(Mission[i].name);
    var namestr = namepos !== -1 ? Mission_txt.slice(namepos + Mission[i].name.length + 1, Mission_txt.indexOf("\n", namepos)).trim().replace("//c", UI_TEXT["comma"]) : null;
    if (namestr && !namestr.match(/(?:don't|do not) translate/i)) {
      Mission[i].name = namestr;
    } else {
      const fallback_match = Mission_cn_txt.match(`${Mission[i].name},(.*)`);
      Mission[i].name = fallback_match ? `[${Mission[i].name}] ${fallback_match[1]}` : `[${Mission[i].name}]`;
    }
  }

  for(i in Enemy_charater_type) {
    var namepos = Enemy_charater_type_txt.indexOf(Enemy_charater_type[i].name);    
    var namestr = namepos !== -1 ? Enemy_charater_type_txt.slice(namepos + Enemy_charater_type[i].name.length + 1, Enemy_charater_type_txt.indexOf("\n", namepos) - 1).trim().replace("//c", UI_TEXT["comma"]) : null;
    if (namestr) {
      Enemy_charater_type[i].name = namestr;
      if (wellKnownEnemyCodes.has(Enemy_charater_type[i].code)) {
        // Certain enemies are known by their codes longer than their localized names, so their codes are
        // added back for clarification.
        Enemy_charater_type[i].name = `[${Enemy_charater_type[i].code}] ${namestr}`;
      } else if (Enemy_charater_type[i].code.match(/swap/i) && !Enemy_charater_type[i].name.match(/swap/i)) {
        // Add " [SWAP]" at the end of the name if the enemy code contains "SWAP" but the name does not.
        // This is because the official English localization sometimes just omits this qualifier...
        Enemy_charater_type[i].name += " [SWAP]";
      }
    } else {
      let prefix = "";
      const fallback_match = Enemy_charater_type_cn_txt.match(`${Enemy_charater_type[i].name},(.*)`);
      if (Enemy_charater_type[i].code) {
        // CHANGE FROM GFWIKI: When dataSource=CN and langCode=EN, for enemy characters without names,
        //     if they have a codename, then display the codename in square brackets.
        prefix = `[${Enemy_charater_type[i].code}]`;
      } else {
        prefix = `[${Enemy_charater_type[i].name}]`;
      }
      Enemy_charater_type[i].name = fallback_match ? `${prefix} ${fallback_match[1]}` : prefix;
    }
  }

  for (i in Ally_team) {
    var namepos = Ally_team_txt.indexOf(Ally_team[i].name);
    var namestr = namepos !== -1 ? Ally_team_txt.slice(namepos + Ally_team[i].name.length + 1, Ally_team_txt.indexOf("\n", namepos) - 1).trim().replace("//c", UI_TEXT["comma"]) : null;
    if (namestr) {
      Ally_team[i].name = namestr;
      Ally_team[i].controllableAlliedTeamName = namestr;
    } else {
      // CHANGE FROM GFWIKI: Team names have table IDs in the format of "ally_team-10000026", even though these
      //     teams can be enemies to the player. If the map just displayed "[ally_team-10000026]" as a placeholder,
      //     that might confuse people who assume that that team is allied with them. Here, we just truncate the "ally_"
      //     part and display "[team-10000026]".
      const teamname_match = Ally_team[i].name.match(/team-\d+/);
      const prefix = teamname_match.length ? `[${teamname_match[0]}]` : `[${Ally_team[i].name}]`;
      const fallback_match = Ally_team_cn_txt.match(`${Ally_team[i].name},(.*)`);
      Ally_team[i].name = fallback_match ? `${prefix} ${fallback_match[1]}` : prefix;
      Ally_team[i].controllableAlliedTeamName = fallback_match ? fallback_match[1] : prefix;
    }
  }

  for (i in Team_ai) {
    var namepos = Team_ai_txt.indexOf(Team_ai[i].name);
    var namestr = namepos !== -1 ? Team_ai_txt.slice(namepos + Team_ai[i].name.length + 1, Team_ai_txt.indexOf("\n", namepos) - 1).trim().replace("//c", UI_TEXT["comma"]) : null;
    if (namestr) {
      Team_ai[i].name = namestr;
    } else {
      Team_ai[i].name = `[${Team_ai[i].name}]`;
    }
  }

  for (i in Mission_targettrain_enemy) {
    var namepos = Mission_targettrain_enemy_txt.indexOf(Mission_targettrain_enemy[i].name);
    var namestr = namepos !== -1 ? Mission_targettrain_enemy_txt.slice(namepos + Mission_targettrain_enemy[i].name.length + 1, Mission_targettrain_enemy_txt.indexOf("\n", namepos) - 1).trim().replace("//c", UI_TEXT["comma"]) : null;
    if (namestr) {
      Mission_targettrain_enemy[i].name = namestr;
    } else {
      const fallback_match = Mission_targettrain_enemy_cn_txt.match(`${Mission_targettrain_enemy[i].name},(.*)`);
      Mission_targettrain_enemy[i].name = fallback_match ? `[${Mission_targettrain_enemy[i].name}] ${fallback_match[1]}` : `[${Mission_targettrain_enemy[i].name}]`;
    }

    const desc_match = Mission_targettrain_enemy_txt.match(`${Mission_targettrain_enemy[i].des},(.*)`);
    const desc_fallback_match = Mission_targettrain_enemy_cn_txt.match(`${Mission_targettrain_enemy[i].des},(.*)`);
    Mission_targettrain_enemy[i].des = (desc_match || desc_fallback_match || ["", ""])[1].replace("//c", UI_TEXT["comma"]);
  }
}

// Create a map of mission IDs to enemy teams that are not initial spawns, but
// are next to teams that are initial spawns for those mission IDs. The idea
// behind this is that enemy teams for a particular mission are usually listed
// next to each other.
const calculateSuspectedSpawns = () => {
  missionIdToSuspectedSpawns = {};
  
  let enemyTeamIdToMissionId = {};
  Spot.forEach((spot) => {
    let enemyTeamId = spot.enemy_team_id;
    if (spot.ally_team_id) {
      const allyTeam = Ally_team.find((allyTeam) => allyTeam.id === spot.ally_team_id);
      if (!allyTeam) {
        return;
      }
      enemyTeamId = allyTeam.enemy_team_id;
    }
    if (enemyTeamId && !(enemyTeamId in enemyTeamIdToMissionId)) {
      enemyTeamIdToMissionId[enemyTeamId] = spot.mission_id;
    }
  });
  
  let lastMissionId = null;
  Enemy_team.forEach((enemyTeam) => {
    if (enemyTeam.id >= 700000 && enemyTeam.id < 800000) {
      return;
    }
    if (enemyTeam.id >= 800000 && enemyTeam.id < 820000) {
      return;
    }
    if (enemyTeam.id >= 1000110 && enemyTeam.id < 1000150) {
      return;
    }
    if (enemyTeam.id in enemyTeamIdToMissionId) {
      lastMissionId = enemyTeamIdToMissionId[enemyTeam.id];
    } else if (lastMissionId && (enemyTeam.id < 1051100 || enemyTeam.id >= 1200000)) {
      if (!(lastMissionId in missionIdToSuspectedSpawns)) {
        missionIdToSuspectedSpawns[lastMissionId] = [];
      }
      missionIdToSuspectedSpawns[lastMissionId].push(enemyTeam.id);
    }
  });

  // AW+ spawns.
  missionIdToSuspectedSpawns[10105] = [...new Set([
    ...(missionIdToSuspectedSpawns[10105] || []),
    2021,2022,2023,2024,2025,2026,2027,2028,2029,2030,2031,2032,2033,2034,2035,2141,2142,2143,2144,2145,2146
  ])];
};

const calculateTheaterLevelAdjustments = () => {
  theaterAreaToLevelAdjustments = {};
  
  Theater_area.forEach((area) => {
    const levelsMatch = area.enemy_lv.match(/^(-?\d+),.*,(-?\d+)$/);
    const teamMatch = area.enemy_group.matchAll(/(?:^|,)(\d+)-/g);
    if (levelsMatch) {
      theaterAreaToLevelAdjustments[area.id] = {
        min: Number(levelsMatch[1]),
        max: Number(levelsMatch[2]),
        enemyTeamIds: [...teamMatch].map((match) => Number(match[1])),
      };
    }
  });
  //console.log(theaterAreaToLevelAdjustments);
};

const calculateDefDrillTeamLevels = () => {
  defDrillTeamsToLevels = {};
  
  trial_info
    .map(({enemy_team_id, enemy_level}) => ({enemy_team_id: Number(enemy_team_id), enemy_level: Number(enemy_level)}))
    .forEach(({enemy_team_id, enemy_level}) => {
      if (!(enemy_team_id in defDrillTeamsToLevels)) {
        defDrillTeamsToLevels[enemy_team_id] = {min: enemy_level, max: enemy_level};
      }
      if (defDrillTeamsToLevels[enemy_team_id].min > enemy_level) {
        defDrillTeamsToLevels[enemy_team_id].min = enemy_level;
      }
      if (defDrillTeamsToLevels[enemy_team_id].max < enemy_level) {
        defDrillTeamsToLevels[enemy_team_id].max = enemy_level;
      }
    });
  console.log(defDrillTeamsToLevels);
};

firstcreat();

const loadImageAsset = (path) => {
  if (path in loadedImageAssets) {
    return Promise.resolve(loadedImageAssets[path]);
  }
  
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      if (!(path in loadedImageAssets)) {
        loadedImageAssets[path] = img;
      }
      resolve(loadedImageAssets[path]);
    };
    img.onerror = () => reject();
    img.src = `./images/${path}`;
  });
};

const isRanking = (mission) => (
  mission.endless_mode === 1 || mission.endless_mode === 2
    // This seems to hold for Fixed Point's maps.
    || mission.score_prize !== ""
);

const getChibiPath = (code) => `map_chibis/${code}_wait0.gif`;
const getChibi = (code) => loadedImageAssets[getChibiPath(code)];
const loadChibi = (code, redrawFunc) => {
  loadImageAsset(getChibiPath(code)).then(() => redrawFunc && redrawFunc());
};

const loadData = async () => {
  const loadTextFile = (url) => fetch(url).then((result) => result.text());
  const loadJsonFile = (url) => fetch(url).then((result) => result.json());

  const loaders = {
    "Spot": loadJsonFile(`./data/${config.dataSource}/Spot.json`).then((result) => Spot = result),
    "Enemy_in_team": loadJsonFile(`./data/${config.dataSource}/Enemy_in_team.json`).then((result) => {
      Enemy_in_team = result;

      Enemy_in_team_by_team_id = {};
      result.forEach((row) => {
        if (!(row.enemy_team_id in Enemy_in_team_by_team_id)) {
          Enemy_in_team_by_team_id[row.enemy_team_id] = [];
        }
        Enemy_in_team_by_team_id[row.enemy_team_id].push(row);
      });
    }),
    "Enemy_standard_attribute": loadJsonFile(`./data/${config.dataSource}/Enemy_standard_attribute.json`).then((result) => Enemy_standard_attribute = result),
    "Enemy_team": loadJsonFile(`./data/${config.dataSource}/Enemy_team.json`).then((result) => {
      Enemy_team = result;
      Enemy_team_map = Object.fromEntries(result.map((enemyTeam) => [enemyTeam.id, enemyTeam]));
    }),
    "Theater_area": loadJsonFile(`./data/${config.dataSource}/Theater_area.json`).then((result) => Theater_area = result),
    "Building": loadJsonFile(`./data/${config.dataSource}/Building.json`).then((result) => {
      Building = result;
      BuildingMap = Object.fromEntries(result.map((building) => [building.id, building]));
    }),
    "Mission": loadJsonFile(`./data/${config.dataSource}/Mission.json`).then((result) => {
      Mission = result;
      Mission_map = Object.fromEntries(result.map((mission) => [mission.id, mission]));
    }),
    "Enemy_character_type": loadJsonFile(`./data/${config.dataSource}/Enemy_character_type.json`).then((result) => {
      Enemy_charater_type = result;
      Enemy_character_type_by_id = Object.fromEntries(result.map((enemy) => [enemy.id, enemy]));
    }),
    "Ally_team": loadJsonFile(`./data/${config.dataSource}/Ally_team.json`).then((result) => Ally_team = result),
    "Gun": loadJsonFile(`./data/${config.dataSource}/Gun.json`).then((result) => {
      Gun = result;
      Gun_by_id = Object.fromEntries(result.map((gun) => [gun.id, gun]));
    }),
    "Gun_in_ally": loadJsonFile(`./data/${config.dataSource}/Gun_in_ally.json`).then((result) => Gun_in_ally = result),
    "Sangvis_in_ally": loadJsonFile(`./data/${config.dataSource}/Sangvis_in_ally.json`).then((result) => Sangvis_in_ally = result),
    "equip_in_ally_info": loadJsonFile(`./data/${config.dataSource}/equip_in_ally_info.json`).then((result) => equip_in_ally_info = result["equip_in_ally_info"]),
    "trial_info": loadJsonFile(`./data/${config.dataSource}/trial_info.json`).then((result) => trial_info = result["trial_info"]),
    /*
    "ConstructibleThings": loadJsonFile(`./data/${config.dataSource}/Recommended_formula.json`).then((result) => {
      result.forEach((formula) => {
        if (formula.develop_type == 1 || formula.develop_type == 2) {
          [...formula.preview.matchAll(/(\d+)-0/g)].forEach((match) => ConstructibleDollIds.add(Number(match[1])));
        } else if (formula.develop_type == 3) {
          [...formula.preview.matchAll(/[:,](\d+)/g)].forEach((match) => ConstructibleEquipIds.add(Number(match[1])));
        }
      });
      return {
        ConstructibleDollIds: [...ConstructibleDollIds],
        ConstructibleEquipIds: [...ConstructibleEquipIds],
      };
    }),
    // */
    "Team_ai": loadJsonFile(`./data/${config.dataSource}/Team_ai.json`).then((result) => Team_ai = result),
    "Mission_targettrain_enemy": loadJsonFile(`./data/${config.dataSource}/Mission_targettrain_enemy.json`).then((result) => Mission_targettrain_enemy = result),
    "UI_TEXT": loadJsonFile(`./text/${config.langCode}/ui_text.json`).then((result) => UI_TEXT = result),

    "Building_txt": loadTextFile(`./text/${config.langCode}/building.txt`).then((result) => Building_txt = result),
    "Building_cn_txt": loadTextFile(`./text/cn/building.txt`).then((result) => Building_cn_txt = result),
    "Equip_txt": loadTextFile(`./text/${config.langCode}/equip.txt`).then((result) => Equip_txt = result),
    "Equip_cn_txt": loadTextFile(`./text/cn/equip.txt`).then((result) => Equip_cn_txt = result),
    "Gun_txt": loadTextFile(`./text/${config.langCode}/gun.txt`).then((result) => Gun_txt = result),
    "Gun_cn_txt": loadTextFile(`./text/cn/gun.txt`).then((result) => Gun_cn_txt = result),
    "Sangvis_txt": loadTextFile(`./text/${config.langCode}/sangvis.txt`).then((result) => Sangvis_txt = result),
    "Sangvis_cn_txt": loadTextFile(`./text/cn/sangvis.txt`).then((result) => Sangvis_cn_txt = result),
    "Mission_txt": loadTextFile(`./text/${config.langCode}/mission.txt`).then((result) => Mission_txt = result),
    "Mission_cn_txt": loadTextFile(`./text/cn/mission.txt`).then((result) => Mission_cn_txt = result),
    "Enemy_charater_type_txt": loadTextFile(`./text/${config.langCode}/enemy_character_type.txt`).then((result) => Enemy_charater_type_txt = result),
    "Enemy_character_type_cn_txt": loadTextFile(`./text/cn/enemy_character_type.txt`).then((result) => Enemy_charater_type_cn_txt = result),
    "Ally_team_txt": loadTextFile(`./text/${config.langCode}/ally_team.txt`).then((result) => Ally_team_txt = result),
    "Ally_team_cn_txt": loadTextFile(`./text/cn/ally_team.txt`).then((result) => Ally_team_cn_txt = result),
    "Team_ai_txt": loadTextFile(`./text/${config.langCode}/team_ai.txt`).then((result) => Team_ai_txt = result),
    "Mission_targettrain_enemy_txt": loadTextFile(`./text/${config.langCode}/mission_targettrain_enemy.txt`).then((result) => Mission_targettrain_enemy_txt = result),
    "Mission_targettrain_enemy_cn_txt": loadTextFile(`./text/cn/mission_targettrain_enemy.txt`).then((result) => Mission_targettrain_enemy_cn_txt = result),
    "Special_spot_config_txt": loadTextFile(`./text/${config.langCode}/special_spot_config.txt`).then((result) => Special_spot_config_txt = result),

    "INSTRUCTIONS": loadTextFile(`./text/${config.langCode}/instructions.html`).then((result) => INSTRUCTIONS = result),
    
    "spot_images": Promise.all(spotPaths.map((path) => loadImageAsset(`spot/${config.langCode}/${path}`))),
  };

  let loadProgress = 0;
  const loadTotal = Object.values(loaders).length;
  const updateLoadProgress = () => $("#loadtips").html(`Loading/文件加载进度: ${loadProgress} / ${loadTotal}`);
  updateLoadProgress();

  data = await Object.entries(loaders).reduce(async (accumulatorPromise, [key, loader]) => {
    (await accumulatorPromise)[key] = await loader;
    loadProgress++;
    updateLoadProgress();
    return await accumulatorPromise;
  }, Promise.resolve({}));
  //console.log(data);
  
  calculateSuspectedSpawns();
  calculateTheaterLevelAdjustments();
  calculateDefDrillTeamLevels();

  trans();
  $("#loadtips").hide();
  $("#otherthing").html(INSTRUCTIONS);

  missioncreat();
  mapsetcreat();
  spotsigncreat();
  enemyselectcreat();

  updatemap();
  enemydisplay(221);
}
loadData();

/*-- 地图绘制事件的全局变量 --*/
var mapwidth = 1200, mapheight = 675;
var xmove = 0, ymove = 0;
var posa={}, posb={};
var coparameter = 1;
var dragging = false;
var scale = 1;

var mspot = [];
var lspot = [];
var dspot = [];
var spotinfo = [];
var theaicontent = null;

var eteamspot = [];

/*-- 下载 sdownload  重置 sredraw  隐藏 smaphide
    敌人 smapenemy  建筑 smapbuild  颜色 smapcolor  标号 smapspotn  逻辑 smapenemyai
    建筑表格 sbuildtable  传送表格 sporttable  点位标记 sspotsign  同组堆叠 senemypile  --*/
var setmessage = {sdownload:0, sredraw:0, smaphide:0, smapenemy:1, smapbuild:1, smapcolor:1, smapspotn:1, smapenemyai:1, sbuildtable:1, sporttable:1, sspotsign:0, senemypile:0};

// This converts the game's campaign IDs (on Mission.json) to the campaign ID
// on the campaign select (UI_TEXT["campaign"]).
function convertGameCampaignToUiCampaign(gameCampaign) {
  switch (gameCampaign) {
    // Cube
    case -1: return 3001;
    // AW
    case -2:
    case -3:
    case -4:
    case -5:
    case -23: return 3002;
    // Cube+
    case -6:
    case -7: return 3006;
    // Rabbit Hunt
    case -8:
    case -30: return 4008;
    // -9 is unused (Neptunia? Valkyria Chronicles?)
    // Deep Dive
    case -10:
    case -11:
    case -12:
    case -13:
    case -29: return 3010;
    // Honk
    case -14:
    case -15: return 4014;
    // Singularity
    case -16:
    case -17:
    case -18:
    case -39: return 3016;
    // DJ Max
    case -19:
    case -20:
    case -21:
    case -22: return 4019;
    // -23 is AW+
    // CT
    case -24:
    case -25:
    case -26:
    case -27:
    case -28:
    case -45: return 3024;
    // -29 is DD+
    // -30 is Rabbit Hunt rerun
    // Isomer
    case -31:
    case -53: return 3031;
    // VA-11 HALL-A
    case -32: return 4032;
    // SC
    case -33:
    case -55: return 3033;
    // Halloween mini-event 1
    case -34: return 5034;
    // Christmas mini-event
    case -35: return 5035;
    // PL
    case -36:
    case -60: return 3036;
    // Valentine's mini-event
    case -37: return 5037;
    // GSG
    case -38: return 4038;
    // -39 is Singularity+
    // Summer mini-event
    case -40: return 5040;
    // DR
    case -41:
    case -63: return 3041;
    // Halloween mini-event 2
    case -42: return 5042;
    // The Division
    case -43: return 4043;
    // MS
    case -44: return 3044;
    // -45 is CT+
    // Jashin-chan
    case -46: return 4046;
    // Summer mini-event 2
    case -47: return 5047;
    // PR
    case -48: return 3048;
    // Xmas mini-event 2
    case -49: return 5049;
    // FP
    case -51: return 3051;
    // Valentine's mini-event 2
    case -50: return 5050;
    // Summer mini-event 3
    case -52: return 5052;
    // -53 is Iso+
    // UNKNOWN SUMMER MINI-EVENT
    case -54: return 3054;
    // -55 is SC+
    // E&S
    case -56: return 3056;
    // ZLSR
    case -57: return 4057;
    // Slow Shock
    case -58: return 3058;
    // Maze Conjecture
    case -59: return 5059;
    // -60 is PL+
    // Mind Voyage
    case -61: return 5061;
    // Reloading
    case -62: return 5062;
    // -63 is DR1+
    // GitS
    case -64: return 4064;
    // -65??
    // Likely Blazar Backscatter
    case -66: return 3066;
    // Grey Zone
    case -404: return 2011;
    // Tutorials
    case -10000:
    case -10001:
    case -10002:
    case -10003:
    case -10004:
    case -10005: return 2009;
    // Mobile Armor Tutorials
    case -10006: return 2012;
  }
}

function getMissionOptionsForCampaign(campaign) {
  let missionOptions = [];
  /*-- 标靶 --*/
  if(campaign == 2008){
      var logarray = [{name: UI_TEXT["drone_sim"], filter:"0"}];
      for (i in Mission_targettrain_enemy) {
          var sign = 1;
          for(j in logarray) if(Mission_targettrain_enemy[i].log_fitter_id == logarray[j].filter) sign = 0;
          if(sign) logarray.push({name:Mission_targettrain_enemy[i].name, filter:Mission_targettrain_enemy[i].log_fitter_id});
      }
      for(i in logarray){
          missionOptions.push({
            value: logarray[i].filter,
            innerHTML: logarray[i].name
          });
      }
  }

  else if(campaign > 6000 && campaign < 7000){
      var area = [0, UI_TEXT["theater_basic"], UI_TEXT["theater_intermediate"], UI_TEXT["theater_advanced"], UI_TEXT["theater_core"]];
      // TODO: place should probably be generated programmatically.
      var place = [
        null,
        [0, UI_TEXT["theater_nonboss"], UI_TEXT["theater_nonboss"], UI_TEXT["theater_nonboss"], UI_TEXT["theater_boss"], UI_TEXT["theater_nonboss"], UI_TEXT["theater_nonboss"], UI_TEXT["theater_nonboss"], UI_TEXT["theater_boss"]],
        [0, UI_TEXT["theater_nonboss"], UI_TEXT["theater_nonboss"], UI_TEXT["theater_nonboss"], UI_TEXT["theater_boss"], UI_TEXT["theater_nonboss"], UI_TEXT["theater_nonboss"], UI_TEXT["theater_nonboss"], UI_TEXT["theater_boss"]],
        [0, UI_TEXT["theater_nonboss"], UI_TEXT["theater_nonboss"], UI_TEXT["theater_boss"], UI_TEXT["theater_nonboss"], UI_TEXT["theater_nonboss"], UI_TEXT["theater_boss"], UI_TEXT["theater_nonboss"], UI_TEXT["theater_boss"]],
        [0, UI_TEXT["theater_nonboss"], UI_TEXT["theater_nonboss"], UI_TEXT["theater_boss"], UI_TEXT["theater_nonboss"], UI_TEXT["theater_nonboss"], UI_TEXT["theater_boss"], UI_TEXT["theater_nonboss"], UI_TEXT["theater_boss"]],
      ];
      for(var i = 1; i < 5; i++){
          for(var j = 1; j < 9; j++){
              missionOptions.push({
                value: (campaign - 6000)*100 + i*10 + j,
                innerHTML: area[i] + " " + j + " " + place[i][j]
              });
          }
      }
  }

  /*-- 主线关卡 --*/
  else if(campaign >= 1000 && campaign < 2000){
      for (i in Mission) {
          if ((Mission[i].campaign == campaign - 1000) && (Mission[i].if_emergency != 2)) {
              var innerHTML = String(campaign - 1000) + "-" + Mission[i].sub;
              innerHTML += (Mission[i].if_emergency == 1) ? "E " : (Mission[i].if_emergency == 3) ? "N " : " ";
              innerHTML += Mission[i].name.replace("//n", " ");
              missionOptions.push({
                value: Number(Mission[i].id),
                innerHTML
              });
          }
      }
  }

  /*-- 模拟作战 --*/
  else if(Number(campaign) === 2009){
    missionOptions = Mission.filter(({campaign}) => [-10000, -10001, -10002, -10003, -10004, -10005].indexOf(campaign) !== -1).map((mission) => ({
      value: Number(mission.id),
      innerHTML: mission.name.replace("//n", " ")
    }));
  }
  else if(campaign == 2010) {
    missionOptions = [{
      value: "defdrill_wave_1",
      innerHTML: UI_TEXT["defdrill_wave_1"],
    }, {
      value: "defdrill_wave_110",
      innerHTML: UI_TEXT["defdrill_wave_110"],
    }];
  }
  else if(Number(campaign) === 2011){
    missionOptions = Mission.filter(({campaign}) => campaign === -404).map((mission) => ({
      value: Number(mission.id),
      innerHTML: mission.name.replace("//n", " ")
    }));
  }
  else if(Number(campaign) === 2012){
    missionOptions = Mission.filter(({campaign}) => campaign === -10006).map((mission) => ({
      value: Number(mission.id),
      innerHTML: mission.name.replace("//n", " ")
    }));
  }
  else if(campaign > 2000 && campaign < 3000){
      for (i in Mission) {
          if ((Mission[i].duplicate_type == campaign - 2000) && (Mission[i].if_emergency == 2)) {
              missionOptions.push({
                value: Number(Mission[i].id),
                innerHTML: Mission[i].sub + " " + Mission[i].name.replace("//n", " ")
              });
          }
      }
  }

  /*-- 有多个章节的活动 --*/
  else if(campaign > 3000 && campaign < 5000){
      for (i in Mission) {
          /*-- 去除剧情关卡 --*/
          if(Mission[i].special_type == 8 || Mission[i].special_type == 9) continue;
          var camp = Number(Mission[i].campaign);
          /*-- 主线活动 --*/
          if (campaign != convertGameCampaignToUiCampaign(camp)) {
            continue;
          }

          var innerHTML = "";
          /*-- 秃洞复刻的识别  并区别联动和主线的基础标号 --*/
          if(campaign < 4000 && ((- Number(camp) - (campaign - 3000 - 1)) > 6)) innerHTML = "";
          else if(campaign > 4000 && ((- Number(camp) - (campaign - 4000 - 1)) > 6)) innerHTML = "复刻 " + Mission[i].sub + " ";
          else innerHTML = String(- Number(camp) - (campaign - ((campaign > 4000) ? 4000 : 3000) - 1)) + "-" + Mission[i].sub + " ";
          /*-- 秃洞的识别 无尽模式 --*/
          if (isRanking(Mission[i])) innerHTML += `[${UI_TEXT["endless_map"]}] `;
          innerHTML += Mission[i].name.replace("//n", " ");
          missionOptions.push({
            value: Number(Mission[i].id),
            innerHTML
          });
      }
  }

  /*-- 支线活动 --*/
  else if(campaign > 5000 && campaign < 6000){
      for (i in Mission) {
          /*-- 去除剧情关卡 --*/
          if(Mission[i].special_type == 8 || Mission[i].special_type == 9) continue;
          if ((Mission[i].campaign == - (campaign - 5000)) && (Mission[i].if_emergency != 2)) {
              var innerHTML = Mission[i].sub + " ";
              if (isRanking(Mission[i])) innerHTML += `[${UI_TEXT["endless_map"]}] `;
              innerHTML += Mission[i].name.replace("//n", " ");
              missionOptions.push({
                value: Number(Mission[i].id),
                innerHTML
              });
          }
      }
  }

  else if(campaign == 9999) {
      for (i in Mission) {
          /*-- 去除剧情关卡 --*/
          if(Mission[i].special_type == 8 || Mission[i].special_type == 9) continue;
          if(Mission[i].campaign >= 0 || convertGameCampaignToUiCampaign(Mission[i].campaign) != null) continue;

          missionOptions.push({
            value: Number(Mission[i].id),
            innerHTML: Mission[i].campaign + "-" + Mission[i].sub + " " + (isRanking(Mission[i]) ? `[${UI_TEXT["endless_map"]}] ` : "") + Mission[i].name.replace("//n", " ")
          });
      }

  }
  return missionOptions;
}

// The better way to implement this would be to just make a dict from Gun_txt and gun.json.
const getGunName = (gun_id, excludeIdFromCnName) => {
  const gunNameRegex = `(gun-1(?:0*)${String(gun_id).padStart(5, '0')},)(.*)`;
  const nativeLanguageMatch = Gun_txt.match(gunNameRegex);
  if (nativeLanguageMatch && nativeLanguageMatch[2]) {
    return nativeLanguageMatch[2];
  } else {
    const cnMatch = Gun_cn_txt.match(gunNameRegex);
    if (excludeIdFromCnName && cnMatch && cnMatch[2]) {
      return cnMatch[2];
    }
    return `[gun-${gun_id}]` + (cnMatch ? ` ${cnMatch[2]}` : "");
  }
};

const getEquipName = (equip_id, excludeIdFromCnName) => {
  const equipNameRegex = `(equip-1(?:0*)${String(equip_id).padStart(5, '0')},)(.*)`;
  const nativeLanguageMatch = Equip_txt.match(equipNameRegex);
  if (nativeLanguageMatch && nativeLanguageMatch[2]) {
    return nativeLanguageMatch[2];
  } else {
    const cnMatch = Equip_cn_txt.match(equipNameRegex);
    if (excludeIdFromCnName && cnMatch && cnMatch[2]) {
      return cnMatch[2];
    }
    return `[equip-${equip_id}]` + (cnMatch ? ` ${cnMatch[2]}` : "");
  }
};

const getSangvisName = (sangvis_id, excludeIdFromCnName) => {
  const nativeLanguageMatch = Sangvis_txt.match(`(sangvis-1[0-9]*${sangvis_id},)(.*)`);
  if (nativeLanguageMatch && nativeLanguageMatch[2]) {
    return nativeLanguageMatch[2];
  } else {
    const cnMatch = Sangvis_cn_txt.match(`(sangvis-1[0-9]*${sangvis_id},)(.*)`);
    if (excludeIdFromCnName && cnMatch && cnMatch[2]) {
      return cnMatch[2];
    }
    return `[sangvis-${sangvis_id}]` + (cnMatch ? ` ${cnMatch[2]}` : "");
  }
};

const dollType = {
  0: 'all',
  1: 'hg',
  2: 'smg',
  3: 'rf',
  4: 'ar',
  5: 'mg',
  6: 'sg',
};

const getAllyGuns = (gunInAllyIds) =>
  gunInAllyIds.map(gunInAllyId => {
    const gunInAllyRow = Gun_in_ally.find(row => row.id == gunInAllyId);
    const gun = Gun_by_id[gunInAllyRow.gun_id];
    const baseStats = gfcore.api.getDollStats(dollType[gun.type], {
      hp: gun.ratio_life,
      pow: gun.ratio_pow,
      hit: gun.ratio_hit,
      dodge: gun.ratio_dodge,
      speed: gun.ratio_speed,
      rate: gun.ratio_rate,
      armorPiercing: gun.armor_piercing,
      criticalPercent: gun.crit,
      armor: gun.ratio_armor,
    }, gun.eat_ratio, {
      level: gunInAllyRow.level,
      dummyLink: gunInAllyRow.number,
      favor: 50,
      growth: false
    });
    // The stats here might have rounding errors due to the game zealously applying ceil/floor to every result
    // in a specific order.
    const approxStats = {
      life: gunInAllyRow.life,
      pow: Math.floor(0.95 * (baseStats.pow + gunInAllyRow.pow)),
      rate: baseStats.rate + gunInAllyRow.rate,
      hit: Math.floor(0.95 * (baseStats.hit + gunInAllyRow.hit)),
      dodge: Math.floor(0.95 * (baseStats.dodge + gunInAllyRow.dodge)),
    };

    const equips = [gunInAllyRow.equip1, gunInAllyRow.equip2, gunInAllyRow.equip3]
      .filter(id => !!id)
      .map(equipInAllyId => equip_in_ally_info.find(equip => equip.id == equipInAllyId));
    const numpadPosition = {7: 1, 8: 4, 9: 7, 12: 2, 13: 5, 14: 8, 17: 3, 18: 6, 19: 9}[gunInAllyRow.position] || "?";
    return {
      approxStats,
      gunInAllyRow,
      name: (gunInAllyRow ? getGunName(gunInAllyRow.gun_id) : null) || `[Gun_in_ally-${gunInAllyId}] ???`,
      code: (Gun.find((doll) => doll.id == gunInAllyRow.gun_id) || {}).code,
      equips,
      numpadPosition
    };
  });

const getAllySangvis = (sangvis) =>
  sangvis.split(",").map(sangvisEntry => {
    const sangvisInAllyId = sangvisEntry.split("-")[0];
    const sangvisInAllyRow = Sangvis_in_ally.find(row => row.id == sangvisInAllyId);
    const numpadPosition = {7: 1, 8: 4, 9: 7, 12: 2, 13: 5, 14: 8, 17: 3, 18: 6, 19: 9}[sangvisEntry.split("-")[1]] || "?";
    return {
      sangvisInAllyRow,
      name: (sangvisInAllyRow ? getSangvisName(sangvisInAllyRow.sangvis_id) : null) || `[Sangvis_in_ally-${sangvisInAllyId}] ???`,
      code: (Sangvis.find((sangvis) => sangvis.id == sangvisInAllyRow.sangvis_id) || {}).code,
      numpadPosition
    };
  });

function updatemap() {
  const params = new URLSearchParams(window.location.hash.slice(1));
  const campaign = params.get("campaign") || $("#campaignselect").val();
  const mission = params.get("mission") || $("#missionselect").val();

  if (campaign != $("#campaignselect").val()) {
    $("#campaignselect").val(campaign);
    const missionOptions = getMissionOptionsForCampaign(campaign);
    missionOptions.forEach((option) => {
      var elem = document.createElement("OPTION");
      elem.value = option.value;
      elem.innerHTML = option.innerHTML;
      $("#missionselect").append(elem);
    });
  }
  $("#missionselect").val(mission);

  if (campaign == 2008) {
    traindisplay(); 
    $("#missioninfo").html("");
    return;
  } else if (campaign == 2010) {
    showDefenseDrill(mission);
    $("#missioninfo").html("");
    return;
  } else if(campaign >= 6000 && campaign < 7000) {
    theaterdisplay();
    $("#missioninfo").html("");
    return;
  }

  const mission_info = Mission_map[Number(mission)];
  if (mission_info) {
    Object.keys(Object.fromEntries(mission_info.map_res_name.split(';').map((bgName) => [bgName])))
      .forEach((bgName) => {
        const bgPath = `bg/${bgName}.jpg`;
        if (!loadedImageAssets[bgPath]) {
          // loadImageAsset(bgPath).then(() => drawmap());
        }
      });
    
    let turnLimit = mission_info.turn_limit > 0 ? mission_info.turn_limit : UI_TEXT["mission_info_unlimited"];
    let advantagedDollsNames = [];
    if (mission_info.adaptive_gun) {
      advantagedDollsNames = mission_info.adaptive_gun.split(",").map((gun_id) => getGunName(gun_id));
    }
    let advantagedDolls = advantagedDollsNames.length > 0 ? advantagedDollsNames.join(", ") : UI_TEXT["mission_info_no_advantaged_dolls"];
    let tableBody = "";
    let notes = [];

    // LS Map 2
    if (mission_info.id === 11118) {
      tableBody =
        `<thead style="display: table-header-group; background-color:#f4c430; color:black;"><tr>
           <th>${Mission_map[11117].name} Score</th>
           <th>${UI_TEXT["mission_info_environment"]}</th>
           <th>${UI_TEXT["mission_info_turn_limit"]}</th>
           <th>${UI_TEXT["mission_info_gk_limit"]}</th>
           <th>${UI_TEXT["mission_info_hoc_limit"]}</th>
           <th>${UI_TEXT["mission_info_coalition_limit"]}</th>
           <th>${UI_TEXT["mission_info_vehicle_limit"]}</th>
           <th>${UI_TEXT["mission_info_total_team_limit"]}</th>
           <th>${UI_TEXT["mission_info_advantaged_dolls"]}</th>
         </tr></thead>
         <tbody>
           <tr>
             <td>[ALL]</td>
             <td>${mission_info.special_type > 0 ? UI_TEXT["mission_info_environment_night"] : UI_TEXT["mission_info_environment_day"]}</td>
             <td>${turnLimit}</td>
             <td>10</td>
             <td>1-4</td>
             <td>0-3</td>
             <td>N/A</td>
             <td>10*</td>
             <td>${advantagedDolls}</td>
           </tr>
           <tr>
             <td>>= 350,000</td>
             <td></td>
             <td></td>
             <td></td>
             <td>4</td>
             <td>?</td>
             <td>N/A</td>
             <td></td>
             <td></td>
           </tr>
         </tbody>`;
      notes.push(UI_TEXT["mission_info_hoc_excluded"]);
    } else {
      const [gkTeamLimit, totalTeamLimit] = mission_info.limit_team.indexOf(",") != -1 ? mission_info.limit_team.split(",") : [mission_info.limit_team, 0];
      let gkLimitDisplay = gkTeamLimit != 0 ? (gkTeamLimit != -1 ? gkTeamLimit : UI_TEXT["mission_info_banned"]) : UI_TEXT["mission_info_unlimited"];
      let hocLimit = mission_info.limit_squad != 0 ? (mission_info.limit_squad != -1 ? mission_info.limit_squad : UI_TEXT["mission_info_banned"]) : UI_TEXT["mission_info_unlimited"];
      let coalitionLimit = mission_info.limit_sangvis != 0 ? (mission_info.limit_sangvis != -1 ? mission_info.limit_sangvis : UI_TEXT["mission_info_banned"]) : UI_TEXT["mission_info_unlimited"];
      let vehicleLimit = mission_info.limit_vehicle != 0 ? (mission_info.limit_vehicle != -1 ? mission_info.limit_vehicle : UI_TEXT["mission_info_banned"]) : UI_TEXT["mission_info_unlimited"];
      let totalTeamLimitDisplay = "";
      if (totalTeamLimit == 0) {
        totalTeamLimitDisplay = UI_TEXT["mission_info_unlimited"];
      } else {
        totalTeamLimitDisplay = totalTeamLimit;
        if (totalTeamLimit.indexOf("*") !== -1) {
          notes.push(UI_TEXT["mission_info_hoc_excluded"]);
        }
      }
      // LS Map 1
      if (mission_info.id === 11117) {
        turnLimit = `<= 4 [1]`;
        notes.push(`[1] One of the win conditions is "Survive 5 Turns", but the map can end earlier with other win conditions.`);
      }
      tableBody =
        `<thead style="display: table-header-group; background-color:#f4c430; color:black;"><tr>
           <th>${UI_TEXT["mission_info_environment"]}</th>
           <th>${UI_TEXT["mission_info_turn_limit"]}</th>
           <th>${UI_TEXT["mission_info_gk_limit"]}</th>
           <th>${UI_TEXT["mission_info_hoc_limit"]}</th>
           <th>${UI_TEXT["mission_info_coalition_limit"]}</th>
           <th>${UI_TEXT["mission_info_vehicle_limit"]}</th>
           <th>${UI_TEXT["mission_info_total_team_limit"]}</th>
           <th>${UI_TEXT["mission_info_advantaged_dolls"]}</th>
         </tr></thead>
         <tbody><tr>
           <td>${mission_info.special_type > 0 ? UI_TEXT["mission_info_environment_night"] : UI_TEXT["mission_info_environment_day"]}</td>
           <td>${turnLimit}</td>
           <td>${gkLimitDisplay}</td>
           <td>${hocLimit}</td>
           <td>${coalitionLimit}</td>
           <td>${vehicleLimit}</td>
           <td>${totalTeamLimitDisplay}</td>
           <td>${advantagedDolls}</td>
         </tr></tbody>`;
    }
    
    $("#missioninfo").html(`
        <table id="Missioninfotable" class="enemydata" style="display: table;margin-top: 10px; table-layout: auto;width: 100%;text-align:center; border:1px #f4c430cc solid; background-color:#111111; margin:4px 0px 14px 0px;" cellspacing="1">
          ${tableBody}
        </table>
        <p>${notes.join("<br>")}</p>
    `);
  } else {
    $("#missioninfo").html("");
  }

  mspot = [];
  for(i in Spot) if(Spot[i].mission_id == mission) mspot.push(Spot[i]);
  lspotcreat();
  dspotcreat();
  missiondisplay();
}

function missioncreat(){
    /*-- 战役的选择创建 --*/
    const availableCampaigns = [...new Set(Mission.map((m) => m.campaign))];
    const missionsToCampaign = Object.fromEntries(Mission.map((m) => [m.id, m.campaign]));

    const initialParams = new URLSearchParams(window.location.hash.slice(1));
    let initialCampaign = initialParams.get("campaign");
    if (!initialCampaign || !(initialCampaign in UI_TEXT["campaigns"])) {
      initialCampaign = 1001;
    }

    let missionOptions = getMissionOptionsForCampaign(initialCampaign);
    let initialMission = initialParams.get("mission");
    if (!initialMission || !missionOptions.find((opt) => opt.value == initialMission)) {
      // If the initial campaign is 9999 (UNKNOWN EVENT/COLLAB), but the mission is no
      // longer classified under it, and the mission still exists, then chances are that
      // the user is using an old link.
      if (initialCampaign == 9999 && initialMission in missionsToCampaign) {
        // Here we try to find out which campaign option the mission is classified
        // under now.
        let newUiCampaign = convertGameCampaignToUiCampaign(Number(missionsToCampaign[initialMission]));
        if (!!newUiCampaign) {
          initialCampaign = newUiCampaign;
        } else {
          // Unable to find. Changing the mission to the first mission of the campaign.
          initialMission = missionOptions.length > 0 ? missionOptions[0].value : null;
        // Correct the URL search string.
        }
        window.history.pushState({}, '', `#campaign=${initialCampaign}&mission=${initialMission}`);
        // Get the updated mission options for the new campaign.
        missionOptions = getMissionOptionsForCampaign(initialCampaign);
      } else {
        initialMission = missionOptions.length > 0 ? missionOptions[0].value : null;
      }
    }

    var campaignOptionsHtml = Object.entries(UI_TEXT["campaigns"])
      // UI_TEXT["campaigns"] includes story chapters that don't exist for forward compatibility,
      // so here we check against availableCampaigns to filter out story chapters that don't exist yet. 
      .filter(([k, v]) => (Number(k) >= 2000 || availableCampaigns.indexOf(Number(k) - 1000) !== -1))
      .map(([k, v]) => `<option value="${k}" ${initialCampaign == k ? "selected" : ""}>${v}</option>`).join("");
    var missionOptionsHtml = missionOptions.map((opt) => `<option value="${opt.value}" ${initialMission == opt.value ? "selected" : ""}>${opt.innerHTML}</option>`).join("");

    var output = `<div style="display:inline-block; padding:6.5px; background:#E0E0E0; color:black; position:relative; top:1px; cursor:default;">${UI_TEXT["map_select"]} ▷</div>
            <div class="eselect"><select id="campaignselect" name="campaignselect">${campaignOptionsHtml}</select></div>
            <div class="eselect"><select id="missionselect" name="missionselect">${missionOptionsHtml}</select></div>

            <div class="eselect" style="width:85px; display:none;"><select id="layerselect" name="layerselect" style="display:block;"></select></div>
            <div id="packselect" style="inline-block; user-select:none; cursor:default; margin:"></div>`;

    $("#campaignchose").html(output);

    /*-- 战役的显示 --*/
    $("#campaignselect").change(function(){
        $("#missionselect").children().remove();
        var campaign = Number(this.value);
        const missionOptions = getMissionOptionsForCampaign(campaign);
        missionOptions.forEach((option) => {
          var elem = document.createElement("OPTION");
          elem.value = option.value;
          elem.innerHTML = option.innerHTML;
          $("#missionselect").append(elem);
        });

        // CHANGE FROM GFWIKI: Campaign/map select now goes through URL state.
        const mission = $("#missionselect").val();
        window.history.pushState({}, '', `#campaign=${campaign}&mission=${mission}`);

        updatemap();
    });

    /*-- 地图的显示 --*/
    $("#missionselect").change(function(){
      // CHANGE FROM GFWIKI: Campaign/map select now goes through URL state.
      const campaign = $("#campaignselect").val();
      const mission = $("#missionselect").val();
      window.history.pushState({}, '', `#campaign=${campaign}&mission=${mission}`);

      updatemap();
    });
    $(window).on('hashchange', function() {
      updatemap();
    });

    /*-- 层叠的显示 --*/
    $("#layerselect").change(function(){
        lspot = [];
        for(i in mspot) if(mspot[i].map_num == $("#layerselect").val()) lspot.push(mspot[i]);
        dspotcreat();
        missiondisplay();
    });

    /*-- 绘制地图画布 --*/
    var drawingoutput = `<canvas id="missiondrawing" width="1200px" height="675px" style="cursor:crosshair;">Your browser does not support the HTML5 canvas tag.</canvas>`;
    $("#missionmap").html(drawingoutput);

    /*-- canvas内鼠标拖拽功能 --*/
    var missiondraw = document.querySelector("#missiondrawing");

    let prevTouches = null;
    const moveMap = function (event) {
      if (!dragging) {
        return;
      }
      if (event.type == 'mousemove' || event.originalEvent.touches.length == 1) {
        if (event.type == 'mousemove') {
          posb = windowToCanvas(event.originalEvent.clientX, event.originalEvent.clientY);
        } else if (event.originalEvent.touches.length > 0) {
          posb = windowToCanvas(event.originalEvent.touches[0].clientX, event.originalEvent.touches[0].clientY);
          event.preventDefault();
        }
        if (prevTouches.length == 1) {
          var x = posb.x - prevTouches[0].x, y = posb.y - prevTouches[0].y;
          xmove += x;
          ymove += y;
          drawmap();
        }
        prevTouches = [Object.assign({}, posb)];
      } else if (event.originalEvent.touches.length == 2) {
        // TODO improve.
        const newTouch0 = windowToCanvas(event.originalEvent.touches[0].clientX, event.originalEvent.touches[0].clientY);
        const newTouch1 = windowToCanvas(event.originalEvent.touches[1].clientX, event.originalEvent.touches[1].clientY);

        if (prevTouches.length == 2) {
          const oldTouchDist = Math.sqrt(Math.pow(prevTouches[0].x - prevTouches[1].x, 2) + Math.pow(prevTouches[0].y - prevTouches[1].y, 2));

          const newCenter = {x: (newTouch0.x + newTouch1.x) / 2, y: (newTouch0.y + newTouch1.y) / 2};
          const newPos = {x:((newCenter.x - xmove)/scale).toFixed(2) , y:((newCenter.y - ymove)/scale).toFixed(2)};
          const newTouchDist = Math.sqrt(Math.pow(newTouch0.x - newTouch1.x, 2) + Math.pow(newTouch0.y - newTouch1.y, 2));
          const newScale = Math.max(0.2, scale * newTouchDist / oldTouchDist);

          scale = newScale;
          xmove = (1-scale)*newPos.x + (newCenter.x - newPos.x);
          ymove = (1-scale)*newPos.y + (newCenter.y - newPos.y);

          drawmap();
        }

        prevTouches = [newTouch0, newTouch1];
        event.preventDefault();
      }
    };

    $(missiondraw).on('mousedown touchstart', function (event) {
      dragging = true;
      if (event.type == 'mousedown') {
        prevTouches = [windowToCanvas(event.originalEvent.clientX, event.originalEvent.clientY)];
      } else if (event.originalEvent.touches.length > 0) {
        prevTouches = [...event.originalEvent.touches].map((touch) => windowToCanvas(touch.clientX, touch.clientY));
        event.preventDefault();
      }
      $(missiondraw).on('mousemove touchmove', moveMap);
    });
    $(missiondraw).on('mouseup touchend', function () {
      dragging = false;
      $(missiondraw).off('mousemove touchmove', moveMap);
    });

    /*-- canvas内鼠标缩放功能 --*/
    $("#missionmap").on("wheel", function (event) {
        var pos = windowToCanvas(event.originalEvent.clientX, event.originalEvent.clientY);
        var newPos = {x:((pos.x - xmove)/scale).toFixed(2) , y:((pos.y - ymove)/scale).toFixed(2)};
        /*-- 获取当前鼠标的滚动情况 --*/
        const wheelDelta = event.originalEvent.wheelDelta || (event.originalEvent.deltaY * (-40));
        if (wheelDelta > 0) {// 放大
            scale += 0.1;
            xmove = (1-scale)*newPos.x + (pos.x - newPos.x);
            ymove = (1-scale)*newPos.y + (pos.y - newPos.y);
        } else if (scale > 0.3) {//  缩小
            // CHANGE FROM GFWIKI: Scale can't go below 0.2.
            scale -= 0.1;
            xmove = (1-scale)*newPos.x + (pos.x - newPos.x);
            ymove = (1-scale)*newPos.y + (pos.y  -newPos.y);
        }
        drawmap();
        event.originalEvent.preventDefault();
    });
}

function lspotcreat(){
    var layernum = [];
    for(i in mspot){
        var sign = 1;
        for(j in layernum) if(mspot[i].map_num == layernum[j]){ sign = 0; break;}
        if(sign) layernum.push(mspot[i].map_num);
    }

    /*-- 优化排版设置 自动隐藏 --*/
    if(layernum.length <= 1){ $("#layerselect").parent().css("display","none");}
    else { $("#layerselect").parent().css("display","inline-block");}

    $("#layerselect").children().remove();
    /*-- 创建层数option --*/
    for(var i = 0; i < layernum.length; i++){
        var op = document.createElement("OPTION");
        op.value = i;
        op.innerHTML = `${UI_TEXT["layer"]} ${i + 1}`;
        $("#layerselect").append(op);
    }

    /*-- lspot的初始化 --*/
    lspot = [];
    for(i in mspot){
        if(mspot[i].map_num == $("#layerselect").val() || mspot[i].map_num == 0) lspot.push(mspot[i]);
    }
}

function dspotcreat(){
    /*-- dspot的初始化 --*/
    dspot = lspot;

    var packagenum = [];
    for(i in lspot){
        var sign = 1;
        for(j in packagenum) if(lspot[i].package == packagenum[j]) { sign = 0; break;}
        if(sign) packagenum.push(lspot[i].package);
    }

    /*-- 优化排版设置 自动隐藏 --*/
    if(packagenum.length <= 1){ $("#packselect").css("display","none");}
    else { $("#packselect").css("display","inline-block");}

    /*-- 区域选择的创建 --*/
    var output = `<div style="display:inline-block; padding:6.5px; background:#E0E0E0; color:black; position:relative; top:1px; cursor:auto;">${UI_TEXT["zone_select"]} ▷</div>
        <div id="packall" class="packcheck" style="display:inline-block; padding:5.5px; background:black; color:#E0E0E0; position:relative; top:1px; cursor:pointer; border:1px #e0e0e0 solid;">${UI_TEXT["zone_select_all"]}</div>
        <div id="packclear" class="packcheck" style="display:inline-block; padding:5.5px; background:black; color:#E0E0E0; position:relative; top:1px; cursor:pointer; border:1px #e0e0e0 solid;">${UI_TEXT["zone_select_none"]}</div>`;
    for(var i = 0; i < packagenum.length; i++){
        output += `<input class="packcheck" type="checkbox" id="package_` +  packagenum[i] + `" value="` +  packagenum[i] + `" checked="checked" /><label for="package_` +  packagenum[i] + `">` +  packagenum[i] + `</label>`;
    }
    $("#packselect").html(output);

    /*-- 区域选择事件 --*/
    $(".packcheck").click(function(){
        if($(this).attr("id") == "packall") $("#packselect").children("input").each(function(){ $(this).parent().children("input[type=checkbox]").prop("checked","checked"); });
        if($(this).attr("id") == "packclear") $("#packselect").children("input").each(function(){ $(this).parent().children("input[type=checkbox]").removeAttr("checked"); });

        var packnum = [];
        $("#packselect").children("input:checked").each(function(){ packnum.push(this.value); });

        dspot = [];
        for(i in lspot){
            var sign = 0;
            for(j in packnum) if(lspot[i].package == packnum[j]){ sign = 1; break;}
            if(sign) dspot.push(lspot[i]);
        }

        missiondisplay();
    });
}

/*-- 地图绘制函数的辅助函数 --*/
function windowToCanvas(x,y) {
    var missiondraw = document.querySelector("#missiondrawing");
    var box = missiondraw.getBoundingClientRect();  //这个方法返回一个矩形对象，包含四个属性：left、top、right和bottom。分别表示元素各边与页面上边和左边的距离
    return {
        x: x - box.left - (box.width - missiondraw.width) / 2,
        y: y - box.top - (box.height - missiondraw.height) / 2
    };
}

function buildingdisplay(){
    var output = `<table id="buildingtable" class="enemydata" style="height: 300px; text-align:center; border:1px #f4c430cc solid; background-color:#111111; margin:4px 0px 14px 0px;" cellspacing="1">
        <thead style="background-color:#f4c430; color:black;"><tr>
        <th>${UI_TEXT["building_location"]}<\/th>
        <th>${UI_TEXT["building_id"]}<\/th>
        <th>${UI_TEXT["building_name"]}<\/th>
        <th>${UI_TEXT["building_hp"]}<\/th>
        <th>${UI_TEXT["building_destruction_method"]}<\/th>
        <th>${UI_TEXT["building_support_range"]}<\/th>
        <th>${UI_TEXT["building_notes"]}<\/th>
        <\/tr><\/thead><tbody id="Buildingbody">`;

    for(i in dspot){
        if(dspot[i].building_id == 0) continue;

        var buildnum = 1;
        for(j in Building) if(dspot[i].building_id == Building[j].id) buildnum = j;

        /*-- 建筑/地图点的可用标记 --*/
        var buildsigndes = "";
        if(Building[buildnum].working_special_spot){
            var buildsignstr = Building[buildnum].working_special_spot.replace(/\|/g, ";");
            while(buildsignstr){
                var thenum = "";
                if(buildsignstr.indexOf(";") == -1){
                    thenum = buildsignstr;
                    buildsignstr = "";
                }
                else if(buildsignstr.indexOf(";") != -1){
                    thenum = buildsignstr.slice(0, buildsignstr.indexOf(";"));
                    buildsignstr = buildsignstr.slice(thenum.length + 1, buildsignstr.length);
                }

                thenum = ("0000000").slice(0, ("0000000").length - thenum.length) + thenum;
                var despos = Special_spot_config_txt.indexOf("special_spot_config-1" + thenum) + ("special_spot_config-1" + thenum).length + 1;
                var newdes = Special_spot_config_txt.slice(despos, Special_spot_config_txt.indexOf("\n", despos));
                var des2pos = Special_spot_config_txt.indexOf("\n", despos) + 1 + ("special_spot_config-2" + thenum).length + 1;
                var new2des = Special_spot_config_txt.slice(des2pos, Special_spot_config_txt.indexOf("\n", des2pos));
                buildsigndes += newdes + ((new2des == newdes || new2des.length <= 1) ? "" : ("(" + new2des + ")")) + ";";
            }
            buildsigndes = buildsigndes.slice(0, buildsigndes.length - 1);
        }

        var thisline = `<tr class="buildingline" style="border-bottom:2px #f4c43033 solid; cursor:pointer;"><td width="120px">`;
        thisline += dspot[i].id + `<\/td><td width="150px">`;
        thisline += Building[buildnum].id + `<\/td><td width="160px">`;
        thisline += Building[buildnum].name + `<\/td><td width="80px">`;
        thisline += Building[buildnum].defender + `<\/td><td width="140px">`;
        thisline += Building[buildnum].is_destroy.replace("0", UI_TEXT["building_indestructible"]).replace("1", UI_TEXT["building_destructible_by_hoc"]).replace("2", UI_TEXT["building_destructible_by_stepping_on"]) + `<\/td><td width="80px">`;
        // CHANGE FROM GFWIKI: Initial state is not displayed.
        //thisline += (Building[buildnum].initial_state == 0 ? UI_TEXT["building_state_open"] : /* initial_state==-1 */UI_TEXT["building_state_closed"]) + `<\/td><td width="80px">`;
        thisline += Building[buildnum].battle_assist_range + `<\/td><td width="544px">`;
        thisline += ((buildsigndes) ? buildsigndes : UI_TEXT["building_notes_other"]) + "<\/td><\/tr>";

        if (Building[buildnum].code && Building[buildnum].code !== "Hiding" && !Building[buildnum].name.match(/兔子/)) {
          //console.log(Building[buildnum].code, Building[buildnum].name);
          spotinfo[i].sbuild = Building[buildnum].name;
          spotinfo[i].buildingCode = Building[buildnum].code;
          loadChibi(Building[buildnum].code, drawmap);
        } else {
          spotinfo[i].sbuild = `[building]`;
        }
        output += thisline;
    }

    $("#buildingshow").css("display", "none");
    if(setmessage.sbuildtable == 1) for(i in spotinfo) if(spotinfo[i].sbuild != 0){ $("#buildingshow").css("display", "block"); break;}

    $("#buildingshow").html(output);

    $(".buildingline").mouseover(function(){
        $(this).children("td").css("background-color", "#f4c43033");
    });
    $(".buildingline").mouseout(function(){
        $(this).children("td").css("background-color", "");
    });
    $(".buildingline").click(function(){
        if(setmessage.sspotsign == 0) $("#sspotsign").click();
        $("#spotsign1").val(Number($($(this).children("td")[0]).html()));
        drawmap();
    });
}

function teleportdisplay(){
    var output = `
      <table id="teleporttable" class="enemydata" style="height: 300px;text-align:center; border:1px #f4c430cc solid; background-color:#111111; margin:4px 0px 14px 0px;" cellspacing="1">
         <thead style="background-color:#f4c430; color:black;"><tr>
          <th>${UI_TEXT["portal_source_layer"]}</th>
          <th>${UI_TEXT["portal_source_zone"]}</th>
          <th>${UI_TEXT["portal_source_location"]}</th>
          <th>${UI_TEXT["portal_to"]}</th>
          <th>${UI_TEXT["portal_dest_layer"]}</th>
          <th>${UI_TEXT["portal_dest_zone"]}</th>
          <th>${UI_TEXT["portal_dest_location"]}<\/th>
          <th>${UI_TEXT["portal_controlling_building_id"]}</th>
          <th>${UI_TEXT["portal_controlling_building_name"]}</th>
          <th></th>
        </tr></thead>
        <tbody id="teleportbody">
    `;

    telespot = [];

    // Introduced in DR.
    // 1) "0:X,Y,Z": Nodes X, Y, and Z has portals that lead this node.
    //   Parsing this seems to be unnecessary because patterns 2 and 3
    //   on the source nodes already cover all portals.
    // const fromXYZToThis = /^0:(\d+(?:,(?:\d+))*)$/;

    // 2) "X:0": This node has portals that lead to node X.
    const fromThisToX = /^(\d+):0$/;

    // 3) Format introduced in MS: "X|Y?|1:A,B,C"
    //   * X is the destination of the portal from this node.
    //   * Y, if specified, is the building ID that can disable this portal.
    //   * A,B,C are nodes with portals that lead to here.
    const conditionalWarp = /^(\d+)\|(\d*)\|1:(\d+(?:,(?:\d+))*)$/;

    for(i in mspot){
      if(!(mspot[i].auto_teleport)) {
        continue;
      }
      const fromThisToXMatch = mspot[i].auto_teleport.match(fromThisToX);
      if (fromThisToXMatch) {
        const srcNodeId = Number(mspot[i].id);
        const destNodeId = Number(fromThisToXMatch[1]);
        if (!telespot.find(t => t.srcNodeId == srcNodeId && t.destNodeId == destNodeId)) { 
          telespot.push({srcNodeId, srcNode: mspot[i], destNodeId, destNode: mspot.find(spot => spot.id == destNodeId)});
        }
        continue;
      }

      const conditionalWarpMatch = mspot[i].auto_teleport.match(conditionalWarp);
      if (conditionalWarpMatch) {
        const srcNodeId = Number(mspot[i].id);
        const destNodeId = Number(conditionalWarpMatch[1]);
        const controllingBuildingId = conditionalWarpMatch[2] ? Number(conditionalWarpMatch[2]) : null;
        const controllingBuilding = controllingBuildingId ? Building.find(b => b.id == controllingBuildingId) : null;
        if (!telespot.find(t => t.srcNodeId == srcNodeId && t.destNodeId == destNodeId)) { 
          telespot.push({srcNodeId, srcNode: mspot[i], destNodeId, destNode: mspot.find(spot => spot.id == destNodeId), controllingBuilding});
        }
        continue;
      }
    }
    output += telespot.map(({srcNode, destNode, controllingBuilding}) => `
      <tr class="teleportline" style="border-bottom:2px #f4c43033 solid; cursor:pointer;">
        <td width="100px">${UI_TEXT["layer"]} ${srcNode.map_num + 1}<\/td>
        <td width="100px">${srcNode.package}<\/td>
        <td width="150px">${srcNode.id}<\/td>
        <td width="100px">TO<\/td><td width="100px">${UI_TEXT["layer"]} ${destNode.map_num + 1}<\/td>
        <td width="100px">${destNode.package}<\/td>
        <td width="150px">${destNode.id}<\/td>
        <td width="150px">${controllingBuilding ? controllingBuilding.id : ""}<\/td>
        <td width="200px">${controllingBuilding ? controllingBuilding.name : ""}<\/td>
        <td width="150px"><\/td>
      <\/tr>
    `).join("");
    output += `</tbody></table>`;

    $("#teleportshow").css("display", "none");
    if(setmessage.sporttable == 1 && telespot.length > 0) $("#teleportshow").css("display", "block");
    $("#teleportshow").html(output);

    $(".teleportline").mouseover(function(){
        $(this).children("td").css("background-color", "#f4c43033");
    });
    $(".teleportline").mouseout(function(){
        $(this).children("td").css("background-color", "");
    });
    $(".teleportline").click(function(){
        if(setmessage.sspotsign == 0) $("#sspotsign").click();
        $("#spotsign2").val(Number($($(this).children("td")[2]).html()));
        $("#spotsign3").val(Number($($(this).children("td")[6]).html()));
        drawmap();
    });
}

const generateEnemyTeamRow = (spot, enemy_team_id, spotAllyTeam, controllableAllyTeamInfo) => {
  let rareDrops = [];
  var teamLeaderEnemyId;
  var efect = 0;
  let hasFakeCeError = false;
  const matchingEnemyTeam = Enemy_team.find((team) => team.id == enemy_team_id);
  /*-- 效能欺诈 --*/
  if (matchingEnemyTeam.effect_ext != 0) {
    efect = Math.abs(matchingEnemyTeam.effect_ext);

    // When using fake CE, the game client can display the incorrect CE... This is due to single-precision
    // floating point errors.
    const enemyUnitCount = Enemy_in_team_by_team_id[enemy_team_id].length;
    const perUnitCE = Math.fround(efect / enemyUnitCount);
    const clientTotal = Math.ceil([...Array(enemyUnitCount)].reduce((subtotal) => Math.fround(subtotal + perUnitCE), 0));
    if (Math.ceil(clientTotal) > efect) {
      hasFakeCeError = true;
    }
  }
  teamLeaderEnemyId = matchingEnemyTeam["enemy_leader"];
  rareDrops = [
    ...matchingEnemyTeam.limit_guns
      .split(",")
      .filter((id) => !!id && id !== "0")
      .map((id) => getGunName(id, /*excludeIdFromCnName=*/true)),
    ...matchingEnemyTeam.limit_equips
      .split(",")
      .filter((id) => !!id && id !== "0")
      .map((id) => getEquipName(id, /*excludeIdFromCnName=*/true)),
  ];
  // Mica didn't put Agent Vector and Agent 416's equips on the drop tables.
  if (matchingEnemyTeam.id == 6431007) {
    rareDrops.push(getEquipName(199, /*excludeIdFromCnName=*/true));
  } else if (matchingEnemyTeam.id == 6431008) {
    rareDrops.push(getEquipName(202, /*excludeIdFromCnName=*/true));
  }

  let teamID = "";
  let teamLeader = "";
  let teamAI = "";
  let teamAIDisplay = "";
  let teamAlignment = "";
  let teamCEPre208 = "";
  let teamCEPost208 = "";
  let teamComposition = "";
  let chibiCode = null;

  if (spotAllyTeam && spotAllyTeam.initial_type == 1) {
    teamID = `ally_team-${spotAllyTeam.id}`;

    if (spotAllyTeam.guns) {
      const allyGuns = getAllyGuns(spotAllyTeam.guns.split(",").filter(gunInAllyId => !!gunInAllyId));
      if (allyGuns.length) {
        const teamLeaderDoll = allyGuns.find(allyGuns => allyGuns.gunInAllyRow["location"] == 1);
        teamLeader = teamLeaderDoll.name;
        chibiCode = teamLeaderDoll.code;
        teamComposition = allyGuns.map(allyGuns => allyGuns.name).join(", ");
      }
    } else if (spotAllyTeam.sangvis) {
      const allySangvis = getAllySangvis(spotAllyTeam.sangvis);
      if (allySangvis.length) {
        teamLeader = allySangvis[0].name;
        chibiCode = allySangvis[0].code;

        let compositionMap = {};
        allySangvis.forEach(unit => {compositionMap[unit.name] = (compositionMap[unit.name] || 0) + 1;});
        teamComposition = Object.entries(compositionMap).map(([name, count]) => `${name} x${count}`).join(", ");
      }
    }

    if (controllableAllyTeamInfo) {
      teamAI = UI_TEXT["team_ai_controllable"];
    } else {
      const AITypeMatch = String(spotAllyTeam["ai"]).match(/^\d+;([0-3]);/);
      if (AITypeMatch) {
        const teamAIType = Number(AITypeMatch[1]);
        const matchingTeamAI = Team_ai.find((teamAI) => teamAI.force_id === 4 && teamAI.ai_type === teamAIType);
        if (matchingTeamAI) {
          teamAI = matchingTeamAI.name;
        }
      }
      if (!teamAI) {
        teamAI = "?";
      }
    }
    teamAIDisplay = teamAI;
    teamAlignment = UI_TEXT["team_alignment_ally"];
    // TODO calculate allied team CE? It's not very useful, though.
  } else {
    /*-- enemyai 敌方行动逻辑 --*/
    let enemy_ai;
    let enemy_ai_num = matchingEnemyTeam["ai"];
    let ai_row = null;
    // force_id = {1 (mission), 2 (enemy), 3 (ally), 4 (friend)}
    if (matchingEnemyTeam["if_stay"]) {
      enemy_ai_num = 999;
      ai_row = Team_ai.find(({force_id, ai_type}) => force_id === 1 && ai_type === enemy_ai_num);
    } else if(enemy_ai_num == 0) {
      enemy_ai_num = Mission_map[Number($("#missionselect").val())].enemy_ai_type;
      ai_row = Team_ai.find(({force_id, ai_type}) => force_id === 1 && ai_type === enemy_ai_num);
    } else {
      ai_row = Team_ai.find(({force_id, ai_type}) => force_id === 2 && ai_type === enemy_ai_num);
    }
    enemy_ai = ai_row?.name;
    let enemy_ai_con = matchingEnemyTeam["ai_content"];

    teamID = enemy_team_id;

    const teamLeaderEnemyCharacterType = Enemy_charater_type.find(e => e.id == teamLeaderEnemyId);
    if (teamLeaderEnemyCharacterType) {
      teamLeader = teamLeaderEnemyCharacterType.name;
      chibiCode = teamLeaderEnemyCharacterType.code;
    } else {
      teamLeader = `[${teamLeaderEnemyId}]`;
    }

    teamAI = enemy_ai;
    teamAIDisplay = enemy_ai + ((enemy_ai == UI_TEXT["team_ai_alert"]) ? ("[" + enemy_ai_con + "]") : "");
    if (ai_row?.pic === "ai_random") {
      teamAI = UI_TEXT["team_ai_random"];
      teamAIDisplay = UI_TEXT["team_ai_random"];
    }
    teamAlignment = spotAllyTeam ? spotAllyTeam.name : UI_TEXT["team_alignment_enemy"];
    teamCEPre208 = efect == 0 ? efectcal(enemy_team_id, 0, 300) : efect;
    teamCEPost208 = efect == 0 ? efectcal(enemy_team_id, 0, 600) : efect;
    teamComposition = enemyoutcal(enemy_team_id);
  }
  
  if (chibiCode) {
    loadChibi(chibiCode, drawmap);
  }

  const teamLocation = spot ? Number(spot["id"]) : "?";

  /*-- 利用数组存储效能数据以优化计算 --*/
  spotinfo.push({
    sename: teamLeader,
    sefectPre208:((efect == 0) ? efectcal(enemy_team_id, 0, 300) : efect),
    sefectPost208:((efect == 0) ? efectcal(enemy_team_id, 0, 600) : efect),
    hasFakeCeError,
    seai: teamAI,
    sbuild: 0,
    spotAllyTeam,
    controllableAllyTeamInfo,
    chibiCode,
  });
  eteamspot.push(enemy_team_id);

  return`<tr class="missionline" style="border-bottom:2px #f4c43033 solid; cursor:pointer;">
    <td width="100px">${teamID}<\/td>
    <td width="160px">${teamLeader}<\/td>
    <td width="100px">${teamAlignment}<\/td>
    <td width="114px">${teamAIDisplay}<\/td>
    <td width="100px">${teamCEPost208}<\/td>
    <td width="290px">${teamComposition}<\/td>
    <td width="200px">${rareDrops.join(", ")}<\/td>
    <td class="cella" width="120px" style="display:table-cell;">${teamLocation}<\/td>
    <td class="cellb" width="120px" style="display:none;">team_num<\/td>
  <\/tr>`;
};

function missiondisplay(){
    /*-- 全局变量清零 --*/
    xmove = 0; ymove = 0;
    xcen = 0; ycen = 0;
    scale = 1;
    posa={}; posb={};
    dragging = false;

    spotinfo = [];
    eteamspot = [];

    var output = `<table id="Missiontable" class="enemydata" style="height:400px;text-align:center; border:1px #f4c430cc solid; background-color:#111111; margin:4px 0px 14px 0px;" cellspacing="1">
        <thead style="background-color:#f4c430; color:black;"><tr>
        <th>${UI_TEXT["team_id"]}</th>
        <th>${UI_TEXT["team_leader"]}</th>
        <th>${UI_TEXT["team_alignment"]}</th>
        <th>${UI_TEXT["team_ai"]}</th>
        <th>${UI_TEXT["team_ce"]}</th>
        <th>${UI_TEXT["team_composition"]}</th>
        <th>${UI_TEXT["team_drops"]}</th>
        <th class="cellacap" style="display:table-cell;">${UI_TEXT["team_location"]}</th>
        <th class="cellbcap" style="display:none;">${UI_TEXT["team_count"]}</th>
        <th></th>
        </tr></thead><tbody id="Missionbody">`;

    
    /*-- 路径点的敌人站位 --*/
    for(var i = 0; i < dspot.length; i++){
      let enemyTeamId;
      let spotAllyTeam = null;
      let controllableAllyTeamInfo = null;
      /*-- 如果是ally，要多套一层寻找enemyid --*/
      if (Number(dspot[i]["enemy_team_id"])) {
        enemyTeamId = Number(dspot[i]["enemy_team_id"]);
      } else if (Number(dspot[i]["ally_team_id"])) {
        const spotAllyTeamId = Number(dspot[i]["ally_team_id"]);
        spotAllyTeam = Ally_team.find(t => t.id == spotAllyTeamId);
        const controllableAllyTeamRegexMatch = spotAllyTeam && spotAllyTeam.initial_type === 1
          ? spotAllyTeam.ai.match(controllableAllyTeamRegex)
          : null;

        if (controllableAllyTeamRegexMatch) {
          enemyTeamId = spotAllyTeam.enemy_team_id;
          controllableAllyTeamInfo = {
            canWithdraw: controllableAllyTeamRegexMatch[1] == "1",
            canQuickFix: controllableAllyTeamRegexMatch[2] == "1",
            canSupply: controllableAllyTeamRegexMatch[3] != "0",
            initialAmmo: Number(controllableAllyTeamRegexMatch[4]),
            initialMre: Number(controllableAllyTeamRegexMatch[5]),
          };
        } else if (spotAllyTeam && spotAllyTeam.enemy_team_id) {
          enemyTeamId = spotAllyTeam.enemy_team_id;
        } else {
          spotinfo.push({sename:0, sefectPre208:0, sefectPost208: 0, seai:0, sbuild:0});
          continue;
        }
      } else if (dspot[i]["hostage_info"] && dspot[i]["hostage_info"].match(/[0-9]+,[1-5]/)) {
        const [dollId, hp] = dspot[i]["hostage_info"].split(",");
        const dollName = getGunName(dollId) || `[${dollId}]`;
        const dollCode = (Gun.find((doll) => doll.id == dollId) || {}).code;
        if (dollCode) {
          loadChibi(dollCode, drawmap);
        }
        spotinfo.push({sename:0, sefectPre208:0, sefectPost208: 0, seai:0, sbuild:0, hostageInfo: {dollName, hp}, chibiCode: dollCode});
        continue;
      } else {
        spotinfo.push({sename:0, sefectPre208:0, sefectPost208: 0, seai:0, sbuild:0});
        continue;
      }

      output += generateEnemyTeamRow(dspot[i], enemyTeamId, spotAllyTeam, controllableAllyTeamInfo);
    }
    
    const missionId = Number($("#missionselect").val());
    if (missionId in missionIdToSuspectedSpawns) {
      output += `<tr><td colspan="8" class="mission-spawn-separator">${UI_TEXT["team_suspected_spawns"]}</td></tr>`
        + missionIdToSuspectedSpawns[missionId]
          .map((enemyTeamId) => generateEnemyTeamRow(null, enemyTeamId, null, null))
          .join('');
    }

    output += `</tbody></table>`;

    $("#missionshow").html(output);
    $(".missionline").mouseover(function(){
        $(this).children("td").css("background-color", "#f4c43033");
    });
    $(".missionline").mouseout(function(){
        $(this).children("td").css("background-color", "");
    });
    $(".missionline").click(function(){
        $(this).parent().children("tr").css({"background-color":"", "color":""});
        $(this).css({"background-color":"#f4c430cc", "color":"black"});
        enemydisplay($(this).children("td").eq(0).html());
        const enemyTeam = Enemy_team_map[Number($($(this).children("td")[0]).html())];
        const spotId = Number($($(this).children("td")[7]).html());
        if(setmessage.sspotsign == 1) {
          $("#spotsign1").val(spotId);
        }
        if ($($(this).children("td")[3]).html() == UI_TEXT["team_ai_patrol"]) {
          theaicontent = {patrol: {spotId, aiContent: enemyTeam.ai_content}};
        } else if ($($(this).children("td")[3]).html().indexOf(UI_TEXT["team_ai_alert"]) != -1) {
          theaicontent = {alert: {spotId, aiContent: enemyTeam.ai_content}};
        } else {
          theaicontent = null;
        }
        drawmap();
    });

    /*-- 同组敌人的数量计算 堆叠 --*/
    var cellbs = document.querySelectorAll(".cellb");
    for(j in cellbs){
        var team_num = 0;
        for(k in eteamspot){ if(eteamspot[j] == eteamspot[k]) team_num ++;}
        cellbs[j].innerText = team_num;
    }

    buildingdisplay();
    teleportdisplay();
    enemypile();
    drawmap();
}

/*-- 地图绘制 --*/
function drawmap(func){
    if (!lspot.length) return;
    /*-- 呈现的地图绘制 1200px --*/
    var con = $("#missiondrawing")[0].getContext("2d");
    /*-- 下载的地图绘制 4800px --*/
    if(func == 2) con = $("#downloaddrawing")[0].getContext("2d");
    con.clearRect(0, 0, mapwidth, mapheight);
    con.lineWidth="1";
    con.strokeStyle="#444444";
    con.fillStyle = "#111111";
    con.beginPath();
    con.fillRect(0, 0, mapwidth, mapheight);
    con.stroke();

    /*-- mapcanvas的预设参数 --*/
    var x_min = Number(lspot[0].coordinator_x);
    var x_max = Number(lspot[0].coordinator_x);
    var y_min = Number(lspot[0].coordinator_y);
    var y_max = Number(lspot[0].coordinator_y);
    for(i in lspot){
        if(Number(lspot[i].coordinator_x) > x_max) x_max = Number(lspot[i].coordinator_x);
        if(Number(lspot[i].coordinator_x) < x_min) x_min = Number(lspot[i].coordinator_x);
        if(Number(lspot[i].coordinator_y) > y_max) y_max = Number(lspot[i].coordinator_y);
        if(Number(lspot[i].coordinator_y) < y_min) y_min = Number(lspot[i].coordinator_y);
    }
    var x_radio = (x_max - x_min + 200)/(mapwidth - mapwidth / 12);
    var y_radio = (y_max - y_min + 200)/(mapheight - mapheight / 12);
    coparameter = (x_radio > y_radio) ? x_radio : y_radio;

    const mission = Mission_map[Number($("#missionselect").val())];
    if (!mission) {
      return;
    }
    const layerIndex = (Number($("#layerselect").val()) || 1) - 1;
    const layerBgName = mission.map_res_name.split(';')[layerIndex];
    const layerBgInfo = mission.map_information.split(';')[layerIndex];
    const layerBgPath = `bg/${layerBgName}.jpg`;
    if (loadedImageAssets[layerBgPath] && layerBgInfo) {
      const layerBgImage = loadedImageAssets[layerBgPath];
      con.save();

      con.fillStyle = mission.special_type > 0 ? "#3B639F" : "white";
      con.fillRect(0, 0, mapwidth, mapheight);
      con.globalCompositeOperation = "multiply";
      const [_, resizedWidth, resizedHeight, cropWidth, cropHeight, offsetX, offsetY] =
        layerBgInfo.match(/^(\d+),(\d+)[|](-?\d+),(-?\d+)[|](-?\d+),(-?\d+)$/);

      const xRatio = layerBgImage.width / Number(resizedWidth);
      const yRatio = layerBgImage.height / Number(resizedHeight);
      const sX = xRatio * ((Number(resizedWidth) - Number(cropWidth)) / 2)
      const sY = yRatio * ((Number(resizedHeight) - Number(cropHeight)) / 2)
      con.drawImage(layerBgImage,
        sX, sY,
        xRatio * Number(cropWidth), yRatio * Number(cropHeight),
        Math.floor(coorchange(1, cropWidth / -2, x_min)), Math.floor(coorchange(2, cropHeight / 2, y_min)),
        coorchange(3, cropWidth), coorchange(3, cropHeight));
      con.restore();
    }

    /*--  路径点的绘制  --*/
    var singlespot = [];
    con.lineWidth = String(30 / coparameter);
    con.strokeStyle = "#cecece";
    // console.log("dspot", dspot);
    for(i in dspot){
        /*--  路径点的连接  --*/
        // CHANGE FROM GFWIKI: Use route instead of map_route.
        // Reference: https://github.com/ccxcxd/GFDB-Decoder/blob/master/GFDecoder/GFDecoder.cs#L261.
        var routestr = dspot[i].route;
        while(routestr){
            //console.log(dspot[i].id + ", routestr=" + routestr);
            var i2Id = Number(routestr.slice(0, (routestr.indexOf(",") == -1) ? (routestr.length) : routestr.indexOf(",")));
            var i2 = -1;

            for(k in dspot){ if(dspot[k].id == i2Id){ i2 = k; break;}}
            // CHANGE FROM GFWIKI: Fix for one-way vs. two-way route detection.
            // Reference: https://github.com/ccxcxd/GFDB-Decoder/blob/master/GFDecoder/GFDecoder.cs#L261.
            if (i2 == -1) {
              //console.log("can't find node: " + i2Id);
            } else if (dspot[i2].route.indexOf(dspot[i].id.toString()) == -1) {
              //console.log("one-way route: " + dspot[i].id + " -> " + dspot[i2].id);
              singlespot.push({a1: i2, a2: i});
            } else {
              //console.log("two-way route: " + dspot[i].id + " <-> " + dspot[i2].id);

              /*--  两个路径点的原始坐标  --*/
              var x1 = Number(dspot[i].coordinator_x);
              var x2 = Number(dspot[i2].coordinator_x);
              var y1 = Number(dspot[i].coordinator_y);
              var y2 = Number(dspot[i2].coordinator_y);

              /*--  双向路径的绘制  --*/
              con.lineWidth = String(coorchange(3, 30));
              con.beginPath();
              con.moveTo(coorchange(1, x1, x_min), coorchange(2, y1, y_min));
              con.lineTo(coorchange(1, x2, x_min), coorchange(2, y2, y_min));
              con.stroke();
            }

            // CHANGE FROM GFWIKI: Removed unnecessary ", j".
            routestr = (routestr.indexOf(",") == -1) ? "" : routestr.slice(routestr.indexOf(",") + 1, routestr.length);
        }
    }

    for(i in singlespot){
        var x1 = Number(dspot[singlespot[i].a1].coordinator_x);
        var x2 = Number(dspot[singlespot[i].a2].coordinator_x);
        var y1 = Number(dspot[singlespot[i].a1].coordinator_y);
        var y2 = Number(dspot[singlespot[i].a2].coordinator_y);

        const theta = Math.atan2(y2 - y1, x2 - x1);
        const arrowStep = 30;
        const arrowStepX = arrowStep * Math.cos(theta);
        const arrowStepY = arrowStep * Math.sin(theta);
        const arrowHeadLength = 25;
        const arrowHeadUpX = arrowHeadLength * Math.cos(theta + Math.PI / 4);
        const arrowHeadUpY = arrowHeadLength * Math.sin(theta + Math.PI / 4);
        const arrowHeadDownX = arrowHeadLength * Math.cos(theta - Math.PI / 4);
        const arrowHeadDownY = arrowHeadLength * Math.sin(theta - Math.PI / 4);
        const numArrows = Math.floor(Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)) / arrowStep);

        con.lineWidth = String(coorchange(3, 10));
        con.strokeStyle = "#cecece";
        con.lineCap = "square";
        for (let i = 0; i < numArrows; i++) {
          // The real game has 3 arrows grouped together.
          if (i % 4 == 0) { 
            continue;
          }
          con.beginPath();
          con.moveTo(coorchange(1, x1 + arrowStepX * i, x_min), coorchange(2, y1 + arrowStepY * i, y_min));
          con.lineTo(coorchange(1, x1 + arrowStepX * i + arrowHeadUpX, x_min), coorchange(2, y1 + arrowStepY * i + arrowHeadUpY, y_min));
          con.stroke();
          con.beginPath();
          con.moveTo(coorchange(1, x1 + arrowStepX * i, x_min), coorchange(2, y1 + arrowStepY * i, y_min));
          con.lineTo(coorchange(1, x1 + arrowStepX * i + arrowHeadDownX, x_min), coorchange(2, y1 + arrowStepY * i + arrowHeadDownY, y_min));
          con.stroke();
        }
    }
    con.lineCap = "butt";

    for(i in dspot){
      /*-- 特殊标点 12ff00 d800ff 00ffea ccff00 --*/
      if (setmessage.sspotsign == 1)  {
        let highlightSpotColor = null;
        if ($("#spotsign1").val() && dspot[i].id == $("#spotsign1").val()) highlightSpotColor = "#12ff00";
        else if ($("#spotsign2").val() && dspot[i].id == $("#spotsign2").val()) highlightSpotColor = "#d800ff";
        else if ($("#spotsign3").val() && dspot[i].id == $("#spotsign3").val()) highlightSpotColor = "#00ffea";
        else if ($("#spotsign4").val() && dspot[i].id == $("#spotsign4").val()) highlightSpotColor = "#ccff00";
        if (highlightSpotColor){
          con.fillStyle = highlightSpotColor;
          con.beginPath();
          con.arc(coorchange(1, Number(dspot[i].coordinator_x), x_min), coorchange(2, Number(dspot[i].coordinator_y), y_min), coorchange(3, 180), 0, 2*Math.PI);
          con.fill();
        }
      }
      
      let belong = dspot[i].belong;
      if (belong > 3) {
        belong = 3;
      }
      let spotFilename = null;
      if (Number(dspot[i].special_eft)) {
        spotFilename = `spot4_belong${belong}`;
      } else if (Number(dspot[i].random_get)) {
        spotFilename = `random_belong${belong}`;
      } else {
        spotFilename = `spot${dspot[i]["type"]}_belong${belong}`;
        if (dspot[i].active_cycle) {
          spotFilename += "_closed";
        }
      }
      if (spotFilename) {
        const spot = loadedImageAssets[`spot/${config.langCode}/${spotFilename}.png`];
        if (spot) {
          //const rawspotWidth = 250;
          const spotRatio = 1.1;
          const spotX = coorchange(1, Number(dspot[i].coordinator_x), x_min) - coorchange(3, spotRatio * spot.width / 2);
          const spotY = coorchange(2, Number(dspot[i].coordinator_y), y_min) - coorchange(3, spotRatio * spot.height / 2);
          const spotWidth = coorchange(3, spotRatio * spot.width);
          const spotHeight = coorchange(3, spotRatio * spot.height);
          con.drawImage(spot, spotX, spotY, spotWidth, spotHeight);
        } else {
          console.error(`Could not load ${spotFilename}`);
        }
      }
      
      // Building chibis.
      if (Number(dspot[i]["building_id"]) && setmessage.smapbuild == 1) {
        const building = BuildingMap[Number(dspot[i]["building_id"])];
        if (building && getChibi(building.code)) {
          const chibi = getChibi(building.code);
          //const rawChibiWidth = 250;
          const chibiRatio = 1;
          const chibiX = coorchange(1, Number(dspot[i].coordinator_x), x_min) - coorchange(3, chibiRatio * chibi.width / 2);
          const chibiY = coorchange(2, Number(dspot[i].coordinator_y), y_min) - coorchange(3, chibiRatio * chibi.height / 2);
          const chibiWidth = coorchange(3, chibiRatio * chibi.width);
          const chibiHeight = coorchange(3, chibiRatio * chibi.height);
          con.drawImage(chibi, chibiX, chibiY, chibiWidth, chibiHeight);
        }
      }
    }
    
    // Chibi display.
    for(i in dspot){
        if((Number(dspot[i]["enemy_team_id"]) || Number(dspot[i]["ally_team_id"]) || dspot[i]["hostage_info"]) && (setmessage.smapenemy == 1)){
            if (spotinfo[i].chibiCode && getChibi(spotinfo[i].chibiCode)) {
              const chibi = getChibi(spotinfo[i].chibiCode);
              //const rawChibiWidth = 250;
              const chibiRatio = 1;
              const chibiX = coorchange(1, Number(dspot[i].coordinator_x), x_min) - coorchange(3, chibiRatio * chibi.width / 2);
              const chibiY = coorchange(2, Number(dspot[i].coordinator_y), y_min) + coorchange(3, -chibiRatio * chibi.height + 50);
              const chibiWidth = coorchange(3, chibiRatio * chibi.width);
              const chibiHeight = coorchange(3, chibiRatio * chibi.height);
              con.drawImage(chibi, chibiX, chibiY, chibiWidth, chibiHeight);
            }
            con.strokeStyle = "#111111";
        }
    }

    for(i in dspot){
        /*-- 建筑名称的展示 --*/
        con.fillStyle = "#eaeaea";
        if((Number(dspot[i]["building_id"])) && (setmessage.smapbuild == 1) && spotinfo[i].sbuild) {
            con.lineWidth= String(coorchange(3, 12));
            con.font = String(coorchange(3, 50)) + `px bold ${fontList}`;
            con.textAlign = "center";
            con.beginPath();
            con.strokeText(spotinfo[i].sbuild, coorchange(1, Number(dspot[i].coordinator_x), x_min), coorchange(2, Number(dspot[i].coordinator_y), y_min) - coorchange(3, 90));
            con.fillText(spotinfo[i].sbuild, coorchange(1, Number(dspot[i].coordinator_x), x_min), coorchange(2, Number(dspot[i].coordinator_y), y_min) - coorchange(3, 90));
            con.stroke();
        }

        /*-- 敌方名称和效能的展示 --*/
        con.fillStyle = "#eaeaea";
        if((Number(dspot[i]["enemy_team_id"]) || Number(dspot[i]["ally_team_id"]) || dspot[i]["hostage_info"]) && (setmessage.smapenemy == 1)){
            con.lineWidth= String(coorchange(3, 12));
            con.font = String(coorchange(3, 50)) + `px bold ${fontList}`;
            con.textAlign = "center";
            con.beginPath();
            let enemyTitle;
            if (spotinfo[i].hostageInfo) {
              enemyTitle = `[${UI_TEXT["map_hostage"]}] ${spotinfo[i].hostageInfo.dollName}`;
            } else if (spotinfo[i].controllableAllyTeamInfo) {
              enemyTitle = `[${UI_TEXT["map_controllable_ally"]}] ${spotinfo[i].spotAllyTeam.controllableAlliedTeamName}`;
            } else if (spotinfo[i].spotAllyTeam) {
              const alignment = spotinfo[i].spotAllyTeam.initial_type === 1 ? UI_TEXT["team_alignment_ally"] : spotinfo[i].spotAllyTeam.name;
              enemyTitle = `${spotinfo[i].sename}`;
            } else {
              enemyTitle = spotinfo[i].sename;
            }
            con.strokeText(enemyTitle, coorchange(1, Number(dspot[i].coordinator_x), x_min), coorchange(2, Number(dspot[i].coordinator_y), y_min) + coorchange(3, 125));
            con.fillText(enemyTitle, coorchange(1, Number(dspot[i].coordinator_x), x_min), coorchange(2, Number(dspot[i].coordinator_y), y_min) + coorchange(3, 125));
            con.stroke();

            con.lineWidth= String(coorchange(3, 8));
            con.font = String(coorchange(3, 42)) + `px bold ${fontList}`;
            con.textAlign = "center";
            con.beginPath();
            let enemySubtitle = null;
            if (spotinfo[i].hostageInfo) {
              enemySubtitle = `${spotinfo[i].hostageInfo.hp} HP`;
            } else if (spotinfo[i].controllableAllyTeamInfo) {
              const {canQuickFix, canSupply, initialMre, initialAmmo} = spotinfo[i].controllableAllyTeamInfo;
              // canWithdraw is not an interesting attribute so it's not displayed here.
              enemySubtitle =
                (canQuickFix
                  ? UI_TEXT["map_controllable_ally_repairable"]
                  : UI_TEXT["map_controllable_ally_unrepairable"]) +
                ", " +
                (canSupply
                  ? `${initialMre} / 10 ${UI_TEXT["map_controllable_ally_mre"]}, ${initialAmmo} / 5 ${UI_TEXT["map_controllable_ally_ammo"]}`
                  : UI_TEXT["map_controllable_ally_infinite_supply"]);
            } else {
              enemySubtitle = "[" + spotinfo[i]["seai"] + "] "
              // + (spotinfo[i]["sefectPre208"] + (spotinfo[i]["hasFakeCeError"] ? 1 : 0)) + "/"
                + (spotinfo[i]["sefectPost208"] + (spotinfo[i]["hasFakeCeError"] ? 1 : 0));
            }
            con.strokeText(enemySubtitle, coorchange(1, Number(dspot[i].coordinator_x), x_min), coorchange(2, Number(dspot[i].coordinator_y), y_min) + coorchange(3, 180));
            con.fillText(enemySubtitle, coorchange(1, Number(dspot[i].coordinator_x), x_min), coorchange(2, Number(dspot[i].coordinator_y), y_min) + coorchange(3, 180));
            con.stroke();
        }

        /*-- 路径点的标号 --*/
        con.textAlign="left";
        if(setmessage.smapspotn == 1){
            con.strokeStyle = "#111111";
            con.lineWidth= String(coorchange(3, 8));
            con.font = String(coorchange(3, 30)) + `px bold ${fontList}`;
            con.beginPath();
            con.strokeText(dspot[i].id, coorchange(1, Number(dspot[i].coordinator_x), x_min) + coorchange(3, 55), coorchange(2, Number(dspot[i].coordinator_y), y_min) + coorchange(3, 70));
            con.fillText(dspot[i].id, coorchange(1, Number(dspot[i].coordinator_x), x_min) + coorchange(3, 55), coorchange(2, Number(dspot[i].coordinator_y), y_min) + coorchange(3, 70));
            con.stroke();
        }
        if (dspot[i].active_cycle) {
          let closedHeliText = "";
          const cycleMatch = dspot[i].active_cycle.match(/^(\d+),(\d+)$/);
          if (cycleMatch) {
            closedHeliText = cycleMatch[1] === '99'
              ? `\u{26D4}∞`
              : `\u{26D4}${cycleMatch[1]}/\u{2705}${cycleMatch[2]}`;
          }
          con.lineWidth = String(coorchange(3, 8));
          con.fillStyle = "#eaeaea";
          con.strokeStyle = "#111111";
          con.textAlign = "left";
          con.font = String(coorchange(3, 30)) + `px bold ${fontList}`;
          con.beginPath();
          con.strokeText(closedHeliText, coorchange(1, Number(dspot[i].coordinator_x), x_min) - coorchange(3, 125), coorchange(2, Number(dspot[i].coordinator_y) , y_min) + coorchange(3, 70));
          con.fillText(closedHeliText, coorchange(1, Number(dspot[i].coordinator_x), x_min) - coorchange(3, 125), coorchange(2, Number(dspot[i].coordinator_y), y_min) + coorchange(3, 70));
          con.stroke();
        }
    }

    /*-- 巡逻路径 --*/
    if(setmessage.sspotsign == 1 && setmessage.smapenemyai == 1 && theaicontent && theaicontent.patrol){
        var content_copy = theaicontent.patrol.aiContent;
        for(var j = 1; content_copy; j++){
            var thisspotid;
            if(content_copy.indexOf(",") != -1){
                thisspotid = content_copy.slice(0, content_copy.indexOf(","));
                content_copy = content_copy.slice(content_copy.indexOf(",") + 1, content_copy.length);
            }
            else {
                thisspotid = content_copy.slice(0, content_copy.length);
                content_copy = "";
                if((thisspotid == theaicontent.patrol.aiContent.slice(0, theaicontent.patrol.aiContent.indexOf(",")))) break;
            }

            var thisspot;
            for(k in dspot) if(dspot[k].id == thisspotid) {thisspot = dspot[k]; break;}

            con.lineWidth= "1";
            con.strokeStyle = "#111111";
            con.fillStyle = "#12ff00";
            con.beginPath();
            con.arc(coorchange(1, Number(thisspot.coordinator_x), x_min), coorchange(2, Number(thisspot.coordinator_y), y_min), coorchange(3, 100), 0, 2*Math.PI);
            con.fill();
            con.stroke();

            con.fillStyle = "#111111";
            con.textAlign="center";
            con.textBaseline="middle";
            con.lineWidth= String(coorchange(3, 20));
            con.font = String(coorchange(3, 150)) + `px bold ${fontList}`;
            con.beginPath();
            con.strokeText(j, coorchange(1, Number(thisspot.coordinator_x), x_min), coorchange(2, Number(thisspot.coordinator_y), y_min));
            con.fillText(j, coorchange(1, Number(thisspot.coordinator_x), x_min), coorchange(2, Number(thisspot.coordinator_y), y_min));
            con.stroke();
        }
    }

    /*-- 警戒范围 --*/
    if(setmessage.sspotsign == 1 && setmessage.smapenemyai == 1 && theaicontent && theaicontent.alert){
        var spotid = theaicontent.alert.spotId;
        var rangearray = [];
        for(i in dspot) if(dspot[i].id == spotid){ rangearray.push({id:spotid, num:i, range:0}); break;}

        var rangenum = 1;
        while(rangenum <= theaicontent.alert.aiContent){
            for(i in dspot){
                var esign = 0;
                for(j in rangearray) if(dspot[i].id == rangearray[j].id){ esign = 1; break;}
                if(esign) continue;

                var jsign = 0;
                for(j in rangearray) if(rangearray[j].range == (rangenum - 1) && dspot[i].route.indexOf(rangearray[j].id) != -1){ jsign = 1; break;}
                if(jsign) rangearray.push({id:dspot[i].id, num:i, range:rangenum});
            }
            rangenum ++;
        }

        for(i in rangearray){
            var thisspot = dspot[rangearray[i].num];

            con.lineWidth= "1";
            con.strokeStyle = "#111111";
            con.fillStyle = "#12ff00";
            con.beginPath();
            con.arc(coorchange(1, Number(thisspot.coordinator_x), x_min), coorchange(2, Number(thisspot.coordinator_y), y_min), coorchange(3, 100), 0, 2*Math.PI);
            con.fill();
            con.stroke();

            con.fillStyle = "#111111";
            con.textAlign="center";
            con.textBaseline="middle";
            con.lineWidth= String(coorchange(3, 20));
            con.font = String(coorchange(3, 150)) + `px bold ${fontList}`;
            con.beginPath();
            con.strokeText(rangearray[i].range, coorchange(1, Number(thisspot.coordinator_x), x_min), coorchange(2, Number(thisspot.coordinator_y), y_min));
            con.fillText(rangearray[i].range, coorchange(1, Number(thisspot.coordinator_x), x_min), coorchange(2, Number(thisspot.coordinator_y), y_min));
            con.stroke();
        }
    }

}

/*-- 地图内的坐标转换为canvas坐标 --*/
function coorchange(xy, a, a_min){
    if(xy == "x" || xy == 1){
        return ((a - a_min + 100) / coparameter + mapwidth/24)*scale + xmove;
    }else if(xy == "y" || xy == 2){
        return (mapheight -(a - a_min + 100) / coparameter - mapheight/24)*scale + ymove;
    }else if(xy == "xy" || xy == 3){
        return (a / coparameter)*scale;
    }
}

function traindisplay(){
    /*-- 清空地图 --*/
    $("#missiondrawing")[0].getContext("2d").clearRect(0, 0, mapwidth, mapheight);
    if(setmessage.smaphide == 0) $("#smaphide").click();
    if(setmessage.sbuildtable == 1) $("#smaphide").click();
    if(setmessage.sporttable == 1) $("#smaphide").click();
    if(setmessage.sspotsign == 1) $("#smaphide").click();
    if(setmessage.senemypile == 1) $("#smaphide").click();

    var output = `<table id="Missiontable" class="enemydata" style="text-align:center; border:1px #f4c430cc solid; background-color:#111111; margin:4px 0px 14px 0px;" cellspacing="1">
        <thead style="background-color:#f4c430; color:black;"><tr>
        <th>${UI_TEXT["target_id"]}</th>
        <th>${UI_TEXT["target_name"]}</th>
        <th>${UI_TEXT["target_composition"]}</th>
        <th>${UI_TEXT["target_description"]}</th>
        </tr></thead><tbody id="Missionbody">`;

    for(i in Mission_targettrain_enemy){
        if(Mission_targettrain_enemy[i].log_fitter_id != $("#missionselect").val()) continue;
        var enemy_team_id = Mission_targettrain_enemy[i].enemy_team_id;

        var thisline = `<tr class="missionline" style="border-bottom:2px #f4c43033 solid; cursor:pointer;"><td width="100px">`;
        thisline += enemy_team_id + `<\/td><td width="160px">`;
        thisline += Mission_targettrain_enemy[i].name + `<\/td><td width="450px">`;
        thisline += enemyoutcal(enemy_team_id) + `<\/td><td width="480px">`;
        thisline += Mission_targettrain_enemy[i].des + "<\/td><\/tr>";

        output += thisline;
    }

    $("#missionshow").html(output);
    $(".missionline").mouseover(function(){
        $(this).children("td").css("background-color", "#f4c43033");
    });
    $(".missionline").mouseout(function(){
        $(this).children("td").css("background-color", "");
    });
    $(".missionline").click(function(){
        $(this).parent().children("tr").css({"background-color":"", "color":""});
        $(this).css({"background-color":"#f4c430cc", "color":"black"});
        enemydisplay($(this).children("td").eq(0).html());
    });
}

function showDefenseDrill(mission) {
  /*-- 清空地图 --*/
  $("#missiondrawing")[0].getContext("2d").clearRect(0, 0, mapwidth, mapheight);
  if(setmessage.smaphide == 0) $("#smaphide").click();
  if(setmessage.sbuildtable == 1) $("#smaphide").click();
  if(setmessage.sporttable == 1) $("#smaphide").click();
  if(setmessage.sspotsign == 1) $("#smaphide").click();
  if(setmessage.senemypile == 1) $("#smaphide").click();

  var output = `<table id="Missiontable" class="enemydata" style="height: 400px; text-align:center; border:1px #f4c430cc solid; background-color:#111111; margin:4px 0px 14px 0px;" cellspacing="1">
      <thead style="background-color:#f4c430; color:black;"><tr>
      <th>${UI_TEXT["defdrill_wave"]}</th>
      <th>${UI_TEXT["defdrill_team_id"]}</th>
      <th>${UI_TEXT["defdrill_composition"]}</th>
      <th>${UI_TEXT["defdrill_environment"]}</th>
      <th>${UI_TEXT["defdrill_ticket_count"]}</th>
      </tr></thead><tbody id="Missionbody">`;

  const trials = mission == "defdrill_wave_110" ? trial_info.filter(({id}) => Number(id) >= 110) : trial_info.filter(({id}) => Number(id) < 110);

  output += trials.map((trial) => {
    let thisline = `<tr class="missionline" style="border-bottom:2px #f4c43033 solid; cursor:pointer;"><td width="80px">`;
    thisline += trial.id + `<td width="100px">`;
    thisline += trial.enemy_team_id + `<\/td><td width="820px">`;
    thisline += enemyoutcal(trial.enemy_team_id) + `<\/td><td width="120px">`;
    thisline += UI_TEXT[trial.is_night == "1" ? "defdrill_environment_night" : "defdrill_environment_day"] + `<\/td><td width="120px">`;
    thisline += trial.reward_voucher + "<\/td><\/tr>";
    return thisline;
  }).join("");

  $("#missionshow").html(output);
  $(".missionline").mouseover(function(){
      $(this).children("td").css("background-color", "#f4c43033");
  });
  $(".missionline").mouseout(function(){
      $(this).children("td").css("background-color", "");
  });
  $(".missionline").click(function(){
      $(this).parent().children("tr").css({"background-color":"", "color":""});
      $(this).css({"background-color":"#f4c430cc", "color":"black"});
      enemydisplay($(this).children("td").eq(1).html());
  });
}

function efectcal(enemy_team_id, levelOffset, armorCoef) {
  var efect = 0;
  let data = [];
  if (!Enemy_in_team_by_team_id[Number(enemy_team_id)]) {
    return 0;
  }

  Enemy_in_team_by_team_id[Number(enemy_team_id)].forEach(({enemy_character_type_id, level, number, def_percent}) => {
    var level = Number(level) + (levelOffset || 0);
    var charatype = Enemy_character_type_by_id[enemy_character_type_id];

    var attr_number = Number(number);
    var attr_pow = enemyattribute(charatype , "pow" , level);
    var attr_def_break = enemyattribute(charatype , "def_break" , level);
    var attr_rate = enemyattribute(charatype , "rate" , level);
    var attr_hit = enemyattribute(charatype , "hit" , level);
    var attr_maxlife = enemyattribute(charatype , "maxlife" , level);
    var attr_dodge = enemyattribute(charatype , "dodge" , level);
    var attr_armor = enemyattribute(charatype , "armor" , level);
    var attr_def = enemyattribute(charatype , "def" , level);
    var attr_tenacity = enemyattribute(charatype , "tenacity", level);
    var attr_def_percent = Number(def_percent);
    /*-- 攻击：ceiling：22*扩编数*((pow + def_break*0.85) * rate/50 * hit/(hit+35) +2) --*/
    var efect_att = ceiling(22*attr_number*((attr_pow + attr_def_break*0.85) * attr_rate/50 * attr_hit/(attr_hit+35) +2));
    /*-- 防御：ceiling：0.25*(maxlife * (35+dodge)/35 * armorCoef/(armorCoef-armor) + 100) * (def_max*2-def+1200*2)/(def_max-def+1200) /2 --*/
    var efect_def = ceiling(
      0.25
        * (bround(attr_number * attr_maxlife)
             * (35+attr_dodge)/35 * armorCoef/(armorCoef-attr_armor)
             * (/* MICAAAAAAAAAAAAAAAAAAAAAAA */ Math.trunc(attr_tenacity / 100) + 1.0 - 0.6/100)
             + 100)
        * (attr_def*2 - attr_def*attr_def_percent/100 + 1200*2)
        / (attr_def - attr_def*attr_def_percent/100 + 1200)
      / 2);
    efect += ceiling(Number(charatype.effect_ratio) * (efect_att + efect_def));
  });
  return efect;
}

const theaterCeCalc = (enemyTeamId, offsets, armorCoef) => {
  const min = efectcal(enemyTeamId, offsets.min, armorCoef);
  const max = efectcal(enemyTeamId, offsets.max, armorCoef);
  return min !== max ? min + "-" + max : min;
};

function theaterdisplay(){
    /*-- 清空地图 --*/
    $("#missiondrawing")[0].getContext("2d").clearRect(0, 0, mapwidth, mapheight);
    if(setmessage.smaphide == 0) $("#smaphide").click();
    if(setmessage.sbuildtable == 1) $("#smaphide").click();
    if(setmessage.sporttable == 1) $("#smaphide").click();
    if(setmessage.sspotsign == 1) $("#smaphide").click();
    if(setmessage.senemypile == 1) $("#smaphide").click();

    var output = `<table id="Missiontable" class="enemydata" style="height: 400px; text-align:center; border:1px #f4c430cc solid; background-color:#111111; margin:4px 0px 14px 0px;" cellspacing="1">
        <thead style="background-color:#f4c430; color:black;"><tr>
        <th>${UI_TEXT["theater_team_id"]}</th>
        <th>${UI_TEXT["theater_team_leader"]}</th>
        <th>${UI_TEXT["theater_team_ce"]}</th>
        <th>${UI_TEXT["theater_team_composition"]}</th>
        <th>${UI_TEXT["theater_team_environment"]}</th>
        <th>${UI_TEXT["theater_team_wave_count"]}</th>
        <th>${UI_TEXT["theater_team_other"]}</th>
        </tr></thead><tbody id="Missionbody">`;

    /*-- 路径点的敌人站位 --*/
    for(i in Theater_area){
        if(Theater_area[i].id != $("#missionselect").val()) continue;
        const theaterLevelAdjustments = theaterAreaToLevelAdjustments[Theater_area[i].id];
        var enemystr = Theater_area[i].enemy_group + ",";

        while(enemystr){
            var enemy_team_id = Number(enemystr.slice(0, enemystr.indexOf("-")));
            // Some theater teams are stitched from EN/JP data. Those teams are given the ID space in 300e7 and 400e7.
            const displayTeamId = (Theater_area[i].source_server ? `(${Theater_area[i].source_server}) ` : "") + (enemy_team_id % 10000000);
            var enemy_num = enemystr.slice(enemystr.indexOf("-") + 1, enemystr.indexOf(","));
            var enemy_odd = (enemy_num.indexOf("-", 3) == -1) ? ("0~" + enemy_num[2]) : (enemy_num[4] + "~" + (Number(enemy_num[2]) + Number(enemy_num[4])));
            if (Theater_area[i].id >= 700) {
              // HACK: Theater 7 wave count per mob = 1
              enemy_odd = 1;
            }

            const teamData = Enemy_team_map[enemy_team_id];
            let enemy_leader = teamData?.enemy_leader;
            var leader_name;
            if (!enemy_leader) {
              let first_enemy = Enemy_in_team.find((row) => row.enemy_team_id === Number(enemy_team_id));
              if (first_enemy) {
                enemy_leader = first_enemy.enemy_character_type_id;
              }
            }
            if (enemy_leader && (enemy_leader in Enemy_character_type_by_id)) {
              leader_name = Enemy_character_type_by_id[enemy_leader].name;
            }

            var thisline = `<tr class="missionline" data-team-id="${enemy_team_id}" style="border-bottom:2px #f4c43033 solid; cursor:pointer;"><td width="100px">`;
            thisline += displayTeamId + `<\/td><td width="160px">`;
            thisline += leader_name + `<\/td><td width="100px">`;
            thisline += theaterCeCalc(enemy_team_id, theaterLevelAdjustments, 300) + ' / ' + theaterCeCalc(enemy_team_id, theaterLevelAdjustments, 300) + `<\/td><td width="490px">`;
            thisline += enemyoutcal(enemy_team_id) + `<\/td><td width="60px">`;
            thisline += ((enemy_num[0] == 0) ? UI_TEXT["theater_team_environment_day"] : UI_TEXT["theater_team_environment_night"]) + `<\/td><td width="100px">`;
            thisline += enemy_odd + `<\/td><td width="180px">`;
            thisline += "<\/td><\/tr>";

            output += thisline;

            enemystr = enemystr.slice(enemystr.indexOf(",") + 1, enemystr.length);
        }
        break;
    }

    $("#missionshow").html(output);
    $(".missionline").mouseover(function(){
        $(this).children("td").css("background-color", "#f4c43033");
    });
    $(".missionline").mouseout(function(){
        $(this).children("td").css("background-color", "");
    });
    $(".missionline").click(function(){
        $(this).parent().children("tr").css({"background-color":"", "color":""});
        $(this).css({"background-color":"#f4c430cc", "color":"black"});
        enemydisplay(Number($(this).attr("data-team-id")));
    });
}

function enemyoutcal(enemy_team_id) {
  let enemies = {};
  let enemies_ids_in_order = new Set();
  if (!Enemy_in_team_by_team_id[Number(enemy_team_id)]) {
    return "<empty team>";
  }

  Enemy_in_team_by_team_id[Number(enemy_team_id)].forEach(({enemy_character_type_id, number}) => {
    if (!(enemy_character_type_id in enemies)) {
      let enemy_character_type = Enemy_charater_type.find((e) => e.id == enemy_character_type_id);
      enemies[enemy_character_type_id] = {name: enemy_character_type ? enemy_character_type.name : "?", count: 0};
      enemies_ids_in_order.add(enemy_character_type_id);
    }
    enemies[enemy_character_type_id].count += number;
  });
  return [...enemies_ids_in_order].map((id) => `${enemies[id].name} x${enemies[id].count}`).join(" ");
}

function enemyselectcreat(){
  const options = [...new Set(Enemy_in_team.map(({enemy_team_id}) => enemy_team_id))].sort().map((x) => String(x))
    .concat(Ally_team.filter(team => team.ai.match(controllableAllyTeamRegex)).map(team => `ally_team-${team.id}`));
  const optionsHtml = options.map(id => `<option value="${id}">${id}</option>`).join("");

  /*-- 绘制画布 --*/
  $("#enemyposition").html(`<canvas id="enemydrawing" width="4800px" height="300px" style="border:1px #ffffff99 solid;">Your browser does not support the HTML5 canvas tag.</canvas>`);

  $("#enemychose").html(`<div style="display:inline-block; padding:6.5px; background:#E0E0E0; color:black; position:relative; top:1px;">${UI_TEXT["enemy_select_team_id"]}</div>
    <div class="eselect"><select id="enemyselect" name="enemyselect">${optionsHtml}</select></div>
    <input type="text" id="enemytext" name="enemytext" style="border:none; padding:10px; background-color:#e0e0e0;"/>`);
  $("#enemyselect").change(function() {
    enemydisplay(Number(this.value));
  });
  $("#enemytext").change(function() {
    if (options.indexOf(this.value) != -1) {
      enemydisplay(this.value);
    } else {
      alert(UI_TEXT["enemy_select_team_nonexistent"]);
    }
  });
}

const numpadPositionToDisplayCoordinates = {
  1: {x: -1.7, y: -0.09},
  4: {x: -1.7, y: 4.11},
  7: {x: -1.7, y: 8.31},
  2: {x: 0.7, y: -0.09},
  5: {x: 0.7, y: 4.11},
  8: {x: 0.7, y: 8.31},
  3: {x: 3.1, y: -0.09},
  6: {x: 3.1, y: 4.11},
  9: {x: 3.1, y: 8.31},
};

function enemyattribute(charatype , attr , level){
    var normalattr = Number(charatype[attr]);
    var normallevel = Number(charatype["level"]);
    if(!Enemy_standard_attribute[0][attr]) return bround(normalattr);
    else if(attr == "def" && normalattr == 99999) return 0;

    var thislevelfactor;
    for(var i = 0; i < Enemy_standard_attribute.length; i++){
        if(Enemy_standard_attribute[i]["level"] != level) continue;
        thislevelfactor = Number(Enemy_standard_attribute[i][attr]);
        break;
    }

    var normallevelfactor;
    for(var i = 0; i < Enemy_standard_attribute.length; i++){
        if(Number(Enemy_standard_attribute[i]["level"]) != normallevel) continue;
        normallevelfactor = Number(Enemy_standard_attribute[i][attr]);
        break;
    }

    return (attr == "maxlife") ? normalattr*thislevelfactor/normallevelfactor : bround(normalattr*thislevelfactor/normallevelfactor);
}

const getTheaterEnemyAttributeRange = (charatype, attr, level, offsets) => {
  let min = enemyattribute(charatype, attr, level + offsets.min);
  let max = enemyattribute(charatype, attr, level + offsets.max);
  if (attr == "maxlife") {
    min = bround(min);
    max = bround(max);
  }
  return min !== max ? min + "-" + max : min;
};

function enemydisplay(enemy_team_id){
    /*-- enemyselect选择被选择的option --*/
    $("#enemyselect").val(enemy_team_id);

    /*-- canvas作图区域清空/画背景以及参考线 --*/
    var con = $("#enemydrawing")[0].getContext("2d");
    con.clearRect(0, 0, 4800, 300);
    con.lineWidth="1";
    con.strokeStyle="#444444";
    con.fillStyle = "#111111";
    con.font=`12px bolder ${fontList}`;
    con.beginPath();
    con.fillRect(0, 0, 4800, 300);
    con.stroke();

    /*-- 参考线横向/纵向线条 --*/
    for(var i = 0; i <= 300 / 25; i++){ dcoordinator(3, "#444444", 0, i);}
    for(var i = 0; i <= 3600/100; i++){
        dcoordinator(2, "#444444", i*4, 0);
        dcoordinator(6, "#444444", i*4, -1, i*4-3);}
    /*-- 我方位置 --*/
    [1, 2, 3, 4, 5, 6, 7, 8, 9].forEach(pos => {
      const {x: x, y: y} = numpadPositionToDisplayCoordinates[pos];
      dcoordinator(1, "#f4c430", x, y);
    });
    /*-- 嘲讽 --*/
    dcoordinator(1, "#3366cc", 4, 3.91);
    dcoordinator(5, "#3366cc", 4, 3.91, UI_TEXT["tactical_display_taunt"]);
    /*-- 双生 --*/
    dcoordinator(1, "#3366cc", 4, 6.91);
    dcoordinator(1, "#3366cc", 4, 1.91);
    con.textAlign = "center";
    dcoordinator(5, "#3366cc", 4, 6.91, UI_TEXT["tactical_display_twin"]);
    dcoordinator(5, "#3366cc", 4, 1.91, UI_TEXT["tactical_display_twin"]);
    /*-- 柯萝伊 --*/
    dcoordinator(1, "#3366cc", 4.3, 6.91);
    dcoordinator(1, "#3366cc", 4.3, 2.21);
    con.textAlign = "left";
    dcoordinator(5, "#3366cc", 4.3, 6.91, UI_TEXT["tactical_display_chloe"]);
    dcoordinator(5, "#3366cc", 4.3, 2.21, UI_TEXT["tactical_display_chloe"]);
    /*-- 射程线 --*/
    dcoordinator(4, "#4caf50", 8.76, 0);
    dcoordinator(4, "#4caf50", 9.76, 0);
    dcoordinator(4, "#4caf50", 10.76, 0);
    dcoordinator(4, "#4caf50", 11.76, 0);
    con.textBaseline = "top";
    dcoordinator(5, "#4caf50", 8.76, 10.5, UI_TEXT["tactical_display_range2_moving"]);
    dcoordinator(5, "#4caf50", 9.76, 9.75, UI_TEXT["tactical_display_range2_still"]);
    dcoordinator(5, "#4caf50", 10.76, 9, UI_TEXT["tactical_display_range3_moving"]);
    dcoordinator(5, "#4caf50", 11.76, 8.25, UI_TEXT["tactical_display_range3_still"]);
    con.textBaseline = "middle";
    con.font = `16px bolder ${fontList}`;

    /*-- 输出的表头 --*/
    const allyTeamMatch = String(enemy_team_id).match(/^ally_team-(\d+)$/);
    let output = "";
    if (allyTeamMatch) {
      const allyTeamId = Number(allyTeamMatch[1]);
      const spotAllyTeam = Ally_team.find(team => team.id == allyTeamId);
      if (spotAllyTeam.guns) {
        const guns = getAllyGuns(spotAllyTeam.guns.split(",").filter(id => !!id));

        const gunsRowsHtml = guns.map(gun => {
          const equips = gun.equips.length ? gun.equips.map(equip => getEquipName(equip.equip_id)).join(",") : UI_TEXT["ally_no_equipment"];
          return `<tr class="enemyline" style="border-bottom:2px #f4c43033 solid;">
             <td class="enemycell" index="1" width="219px">${gun.name}<\/td>
             <td class="enemycell" index="2" width="59px">${gun.gunInAllyRow.number}<\/td>
             <td class="enemycell" index="3" width="59px">${gun.gunInAllyRow.gun_level}<\/td>
             <td class="enemycell" index="4" width="59px">${gun.approxStats.life}<\/td>
             <td class="enemycell" index="5" width="59px">${gun.approxStats.pow}<\/td>
             <td class="enemycell" index="6" width="59px">${gun.approxStats.rate}<\/td>
             <td class="enemycell" index="7" width="59px">${gun.approxStats.hit}<\/td>
             <td class="enemycell" index="8" width="59px">${gun.approxStats.dodge}<\/td>
             <td class="enemycell" index="9" width="453px">${equips}<\/td>
             <td class="enemycell" index="10" width="100px">${gun.numpadPosition}<\/td><\/tr>`
        }).join("");

        output = `
            <div class="note">
              Note: The ally doll stats below do not include equipment stats. I haven't reverse engineered how equipment stats for allied dolls are calculated yet :(
            </div>
            <table id="Eenmytable" class="enemydata" style="text-align:center; border:1px #f4c430cc solid; background-color:#111111; margin:4px 0px 14px 0px;" cellspacing="1">
            <thead style="background-color:#f4c430; color:black;"><tr>
              <th>${UI_TEXT["ally_name"]}<\/th>
              <th>${UI_TEXT["ally_links"]}<\/th>
              <th>${UI_TEXT["ally_level"]}<\/th>
              <th>${UI_TEXT["ally_hp"]}<\/th>
              <th>${UI_TEXT["ally_fp"]}<\/th>
              <th>${UI_TEXT["ally_rof"]}<\/th>
              <th>${UI_TEXT["ally_acc"]}<\/th>
              <th>${UI_TEXT["ally_eva"]}<\/th>
              <th>${UI_TEXT["ally_equipment"]}<\/th>
              <th>${UI_TEXT["ally_position"]}<\/th>
            <\/tr><\/thead>
            <tbody id="Eenmybody">
              ${gunsRowsHtml}
            </tbody>
          </table>`;

        guns.forEach(gun => {
          const {x: x, y: y} = numpadPositionToDisplayCoordinates[gun.numpadPosition];
          dcoordinator(1, "#3366cc", x, y);
          dcoordinator(5, "#3366cc", x, y, gun.name);
        });
      } else if (spotAllyTeam.sangvis) {
        const allySangvis = getAllySangvis(spotAllyTeam.sangvis);

        const sangvisRowsHtml = allySangvis.map(sangvis =>
          `<tr class="enemyline" style="border-bottom:2px #f4c43033 solid;">
             <td class="enemycell" index="1" width="219px">${sangvis.name}<\/td>
             <td class="enemycell" index="2" width="866px">TODO<\/td>
             <td class="enemycell" index="3" width="100px">${sangvis.numpadPosition}<\/td><\/tr>`
        ).join("");
        output = `
            <div class="note">
              Note: I haven't reverse engineered how to calculate controllable allied Sangvis units' stats yet :(. I hope we don't get a ranking map with one.
            </div>
            <table id="Eenmytable" class="enemydata" style="text-align:center; border:1px #f4c430cc solid; background-color:#111111; margin:4px 0px 14px 0px;" cellspacing="1">
            <thead style="background-color:#f4c430; color:black;"><tr>
              <th>${UI_TEXT["ally_name"]}<\/th>
              <th>TODO<\/th>
              <th>${UI_TEXT["ally_position"]}<\/th>
            <\/tr><\/thead>
            <tbody id="Eenmybody">
              ${sangvisRowsHtml}
            </tbody>
          </table>`;

        allySangvis.forEach(sangvis => {
          const {x: x, y: y} = numpadPositionToDisplayCoordinates[sangvis.numpadPosition];
          dcoordinator(1, "#3366cc", x, y);
          dcoordinator(5, "#3366cc", x, y, sangvis.name);
        });
      }
    } else {
      output = '';
      
      let theaterLevelAdjustments = null;
      let defDrillLevels = null;
      const missionId = Number($("#missionselect").val());
      if (Number($("#campaignselect").val()) >= 6000
           && missionId in theaterAreaToLevelAdjustments
           && theaterAreaToLevelAdjustments[missionId].enemyTeamIds.indexOf(Number(enemy_team_id)) !== -1) {
        theaterLevelAdjustments = theaterAreaToLevelAdjustments[Number($("#missionselect").val())];
        const theaterAreaName = $("#campaignselect").find("option:selected").text()
          + " - " + $("#missionselect").find("option:selected").text();
        
        output = `
          <div class="note">
            Theater mobs gain levels and stats proportionally to the wave count, so the same mob is
            generally stronger at wave 10 than it would be at wave 1. The stats below reflect the
            min (${theaterLevelAdjustments.min}) and max (${theaterLevelAdjustments.max}) level
            adjustments of the currently selected theater area "${theaterAreaName}".
          </div>`;
      } else if ((enemy_team_id in defDrillTeamsToLevels)
          && defDrillTeamsToLevels[enemy_team_id].min > 0
          && defDrillTeamsToLevels[enemy_team_id].max > 0) {
        defDrillLevels = defDrillTeamsToLevels[enemy_team_id];
        
        output = `
          <div class="note">
            This team is used in Defense Drill, which specifies enemy levels for each Defense Drill stage.
            Enemy stats below are computed from the Defense Drill level range.
          </div>`;
      }
      
      output += `<table id="Eenmytable" class="enemydata" style="text-align:center; border:1px #f4c430cc solid; background-color:#111111; margin:4px 0px 14px 0px;" cellspacing="1">
        <thead style="background-color:#f4c430; color:black;"><tr>
          <th>${UI_TEXT["enemy_name"]}<\/th>
          <th>${UI_TEXT["enemy_links"]}<\/th>
          <th>${UI_TEXT["enemy_level"]}<\/th>
          <th>${UI_TEXT["enemy_hp"]}<\/th>
          <th>${UI_TEXT["enemy_fp"]}<\/th>
          <th>${UI_TEXT["enemy_rof"]}<\/th>
          <th>${UI_TEXT["enemy_acc"]}<\/th>
          <th>${UI_TEXT["enemy_eva"]}<\/th>
          <th>${UI_TEXT["enemy_range"]}<\/th>
          <th>${UI_TEXT["enemy_mspd"]}<\/th>
          <th>${UI_TEXT["enemy_ap"]}<\/th>
          <th>${UI_TEXT["enemy_armor"]}<\/th>
          <th>${UI_TEXT["enemy_tenacity"]}<\/th>
          <th>${UI_TEXT["enemy_debuff_res"]}<\/th>
          <th>${UI_TEXT["enemy_hp_shield"]}<\/th>
          <th>${UI_TEXT["enemy_forceshield_max"]}<\/th>
          <th>${UI_TEXT["enemy_forceshield_initial_pct"]}<\/th>
          <th>${UI_TEXT["enemy_coordinates"]}<\/th>
        <\/tr><\/thead>
        <tbody id="Eenmybody">`;

      Enemy_in_team_by_team_id[Number(enemy_team_id)].forEach(({enemy_character_type_id, level, number, def_percent, coordinator_x, coordinator_y}) => {
        /*-- 敌人type 基础属性/当前属性 --*/
        var charatype = Enemy_character_type_by_id[enemy_character_type_id];

        let displayedValues = {};
        if (theaterLevelAdjustments) {
          displayedValues = {
            level: (level % 1000 + theaterLevelAdjustments.min) + "-" + (level % 1000 + theaterLevelAdjustments.max),
            hp: getTheaterEnemyAttributeRange(charatype, "maxlife", level, theaterLevelAdjustments),
            pow: getTheaterEnemyAttributeRange(charatype, "pow", level, theaterLevelAdjustments),
            rate: getTheaterEnemyAttributeRange(charatype, "rate", level, theaterLevelAdjustments),
            hit: getTheaterEnemyAttributeRange(charatype, "hit", level, theaterLevelAdjustments),
            dodge: getTheaterEnemyAttributeRange(charatype, "dodge", level, theaterLevelAdjustments),
            range: getTheaterEnemyAttributeRange(charatype, "range", level, theaterLevelAdjustments),
            speed: getTheaterEnemyAttributeRange(charatype, "speed", level, theaterLevelAdjustments),
            armor_piercing: getTheaterEnemyAttributeRange(charatype, "armor_piercing", level, theaterLevelAdjustments),
            armor: getTheaterEnemyAttributeRange(charatype, "armor", level, theaterLevelAdjustments),
            tenacity: charatype.tenacity,
            debuff_resistance: charatype.debuff_resistance,
            shield: getTheaterEnemyAttributeRange(charatype, "shield", level, theaterLevelAdjustments),
            //def_break: getTheaterEnemyAttributeRange(charatype, "def_break", level, theaterLevelAdjustments),
            def: getTheaterEnemyAttributeRange(charatype, "def", level, theaterLevelAdjustments),
          };
        } else if (defDrillLevels) {
          const adjustments = {min: defDrillLevels.min - level, max: defDrillLevels.max - level};
          displayedValues = {
            level: (defDrillLevels.min % 1000) === (defDrillLevels.max % 1000)
              ? (defDrillLevels.min % 1000)
              : (defDrillLevels.min % 1000) + "-" + (defDrillLevels.max % 1000),
            hp: getTheaterEnemyAttributeRange(charatype, "maxlife", level, adjustments),
            pow: getTheaterEnemyAttributeRange(charatype, "pow", level, adjustments),
            rate: getTheaterEnemyAttributeRange(charatype, "rate", level, adjustments),
            hit: getTheaterEnemyAttributeRange(charatype, "hit", level, adjustments),
            dodge: getTheaterEnemyAttributeRange(charatype, "dodge", level, adjustments),
            range: getTheaterEnemyAttributeRange(charatype, "range", level, adjustments),
            speed: getTheaterEnemyAttributeRange(charatype, "speed", level, adjustments),
            armor_piercing: getTheaterEnemyAttributeRange(charatype, "armor_piercing", level, adjustments),
            armor: getTheaterEnemyAttributeRange(charatype, "armor", level, adjustments),
            tenacity: charatype.tenacity,
            debuff_resistance: charatype.debuff_resistance,
            shield: getTheaterEnemyAttributeRange(charatype, "shield", level, adjustments),
            //def_break: getTheaterEnemyAttributeRange(charatype, "def_break", level, adjustments),
            def: getTheaterEnemyAttributeRange(charatype, "def", level, adjustments),
          };
        } else {
          displayedValues = {
            level: level % 1000,
            hp: bround(enemyattribute(charatype , "maxlife" , level)),
            pow: enemyattribute(charatype , "pow" , level),
            rate: enemyattribute(charatype , "rate" , level),
            hit: enemyattribute(charatype , "hit" , level),
            dodge: enemyattribute(charatype , "dodge" , level),
            range: enemyattribute(charatype , "range" , level),
            speed: enemyattribute(charatype , "speed" , level),
            armor_piercing: enemyattribute(charatype , "armor_piercing" , level),
            armor: enemyattribute(charatype , "armor" , level),
            tenacity: charatype.tenacity,
            debuff_resistance: charatype.debuff_resistance,
            shield: enemyattribute(charatype , "shield" , level),
            //def_break: enemyattribute(charatype , "def_break" , level),
            def: enemyattribute(charatype , "def" , level),
          };
        }

        var thisline = `<tr class="enemyline" style="border-bottom:2px #f4c43033 solid;"><td class="enemycell" index="1">`;
        thisline += charatype["name"] + `<\/td><td class="enemycell" index="2">`;
        thisline += Number(number) + `<\/td><td class="enemycell" index="3">`;
        thisline += displayedValues.level + `<\/td><td class="enemycell" index="4">`;
        thisline += displayedValues.hp + `<\/td><td class="enemycell" index="5">`;
        thisline += displayedValues.pow + `<\/td><td class="enemycell" index="6">`;
        thisline += displayedValues.rate + `<\/td><td class="enemycell" index="7">`;
        thisline += displayedValues.hit + `<\/td><td class="enemycell" index="8">`;
        thisline += displayedValues.dodge + `<\/td><td class="enemycell" index="9">`;
        thisline += displayedValues.range + `<\/td><td class="enemycell" index="10">`;
        thisline += displayedValues.speed + `<\/td><td class="enemycell" index="11">`;
        thisline += displayedValues.armor_piercing + `<\/td><td class="enemycell" index="12">`;
        thisline += displayedValues.armor + `<\/td><td class="enemycell" index="13">`;
        thisline += displayedValues.tenacity + `<\/td><td class="enemycell" index="14">`;
        thisline += displayedValues.debuff_resistance + `<\/td><td class="enemycell" index="15">`;
        thisline += displayedValues.shield + `<\/td><td class="enemycell" index="16">`;
        //thisline += displayedValues.def_break + `<\/td><td class="enemycell" index="16" width="79px">`;
        thisline += displayedValues.def + `<\/td><td class="enemycell" index="17">`;
        thisline += Number(def_percent) + `%<\/td><td class="enemycell" index="18">`;
        thisline += "(" + coordinator_x + "," + coordinator_y + `)<\/td><\/tr>`;

        output += thisline;

        dcoordinator(1, "#e91e63", coordinator_x, coordinator_y);
        dcoordinator(5, "#e91e63", coordinator_x, coordinator_y, charatype["name"]);
      });
      output += "</tbody></table>";
    }

    $("#enemyshow").html(output);

    /*-- 敌人信息行的查看效果 --*/
    $("#Eenmybody").mouseout(function(){
        $(this).children("tr").children("td").css("background-color", "");
    });
    $(".enemyline").mouseover(function(){
        $(this).children("td").css("background-color", "#f4c43033");
    });
    $(".enemyline").mouseout(function(){
        $(this).children("td").css("background-color", "");
    });
    $(".enemycell").mouseover(function(){
        $(this).parent("tr").parent("tbody").children("tr").children("td").css("background-color", "");
        var trs = $(this).parent().parent().children("tr");
        for(var i = 0; i < trs.length; i++){
            $(trs[i]).children("td")[Number($(this).attr("index")) - 1].style.backgroundColor = "#f4c43033";
        }
    });
}

function dcoordinator(type, color, x, y, z){
    var con = $("#enemydrawing")[0].getContext("2d");
    con.lineWidth="1";
    con.strokeStyle = color;
    con.fillStyle = color;

    con.beginPath();
    switch(type){
        case 1: {
            con.arc((3 + x)*50, (11 - y)*25, 3, 0, 2*Math.PI);
            con.fill();
        }break;
        case 2: {
            con.moveTo(x*50, 0);
            con.lineTo(x*50, 300);
        }break;
        case 3: {
            con.moveTo(0, y*25);
            con.lineTo(4800, y*25);
        }break;
        case 4: {
            con.moveTo((3 + x)*50, 0);
            con.lineTo((3 + x)*50, 300);
        }break;
        case 5: {
            con.lineWidth="0.5";
            con.strokeText(z, (3 + x)*50, (11 - y)*25 - 5);
            con.fillText(z, (3 + x)*50, (11 - y)*25 - 5);
        }break;
        case 6: {
            con.lineWidth="0.5";
            con.strokeText(z, x*50, 298);
            con.fillText(z, x*50, 298);
        }break;
        default: break;
    }
    con.stroke();
}

function ceiling(a){
    return (a%1) ? (a-a%1 + 1) : a;
}

function bround(a){
    if(a%1 == 0.5 && (a - 0.5)%2 == 1) return a+0.5 ;
    else if(a%1 == 0.5 && (a - 0.5)%2 == 0) return a-0.5 ;
    else return Number(a.toFixed(0));
}

function mapsetcreat(){
    /*下载 sdownload  重置 sredraw  隐藏 smaphide
    敌人 smapenemy  建筑 smapbuild   标号 smapspotn  逻辑 smapenemyai
    建筑表格 sbuildtable  传送表格 sporttable  点位标记 sspotsign  同组堆叠 senemypile  --*/
    var mapsetoutput = `<div class="mapsetbtncontainer">
      <div class="mapsetbtn" id="sdownload" style="display:inline-block; user-select:none; border:1px #eaeaea solid; padding:5px 10px;"><a style="color:#eaeaea; text-decoration:auto;">${UI_TEXT["function_download_map"]}</a></div>
      <div class="mapsetbtn" id="sredraw" style="display:inline-block; user-select:none; border:1px #eaeaea solid; padding:5px 10px; cursor:pointer;">${UI_TEXT["function_reset_map"]}</div>
      <div class="mapsetbtn" id="smaphide" style="display:inline-block; user-select:none; border:1px #eaeaea solid; padding:5px 10px; cursor:pointer;">${UI_TEXT["function_hide_map"]}</div>
    </div>
    <div class="mapsetbtncontainer">
      <div class="mapsetbtn" id="smapenemy" style="display:inline-block; user-select:none; border:1px #eaeaea solid; padding:5px 10px; background-color:#f4c430; color:black; cursor:pointer;">${UI_TEXT['display_setting_enemies']}</div>
      <div class="mapsetbtn" id="smapbuild" style="display:inline-block; user-select:none; border:1px #eaeaea solid; padding:5px 10px; background-color:#f4c430; color:black; cursor:pointer;">${UI_TEXT['display_setting_buildings']}</div>
      <div class="mapsetbtn" id="smapspotn" style="display:inline-block; user-select:none; border:1px #eaeaea solid; padding:5px 10px; background-color:#f4c430; color:black; cursor:pointer;">${UI_TEXT['display_setting_location']}</div>
      <div class="mapsetbtn" id="smapenemyai" style="display:inline-block; user-select:none; border:1px #eaeaea solid; padding:5px 10px; background-color:#f4c430; color:black; cursor:pointer;">${UI_TEXT['display_setting_ai']}</div>
    </div>
    <div class="mapsetbtncontainer">
      <div class="mapsetbtn" id="sbuildtable" style="display:inline-block; user-select:none; border:1px #eaeaea solid; padding:5px 10px; background-color:#f4c430; color:black; cursor:pointer;">${UI_TEXT['display_setting_buildings_table']}</div>
      <div class="mapsetbtn" id="sporttable" style="display:inline-block; user-select:none; border:1px #eaeaea solid; padding:5px 10px; background-color:#f4c430; color:black; cursor:pointer;">${UI_TEXT['display_setting_portals_table']}</div>
      <div class="mapsetbtn" id="sspotsign" style="display:inline-block; user-select:none; border:1px #eaeaea solid; padding:5px 10px; cursor:pointer;">${UI_TEXT['display_setting_node_markings']}</div>
      <div class="mapsetbtn" id="senemypile" style="display:inline-block; user-select:none; border:1px #eaeaea solid; padding:5px 10px; cursor:pointer;">${UI_TEXT['display_setting_combine_enemies']}</div>
    </div>`;

    $("#mapsetdiv").css({"user-select":"none", "margin":"5px 0px"});
    $("#mapsetdiv").html(mapsetoutput);

    $(".mapsetbtn").mouseover(function(){
        $(this).css({"border":"1px #f4c430 solid","padding":"5px 10px"});
    });
    $(".mapsetbtn").mouseout(function(){
        $(this).css({"border":"1px #eaeaea solid","padding":"5px 10px"});
    });
    $(".mapsetbtn").mousedown(function(){
        if($(this).attr("id") != "sdownload" && $(this).attr("id") != "sredraw") return;
        $(this).css({"background-color":"#f4c430aa","color":"black"});
    });
    $(".mapsetbtn").mouseup(function(){
        if($(this).attr("id") != "sdownload" && $(this).attr("id") != "sredraw") return;
        $(this).css({"background-color":"#111111","color":"#eaeaea"});
    });

    $(".mapsetbtn").click(function(){
        var setid = $(this).attr("id");
        /*-- 下载功能 --*/
        if(setid == "sdownload"){
            mapwidth = 4800; mapheight = 2700;
            /*-- 创建更大的新画布 --*/
            var drawingoutput = `<canvas id="downloaddrawing" width="4800px" height="2700px" style="display:none;">Your browser does not support the HTML5 canvas tag.</canvas>`;
            $("#downloaddraw").html(drawingoutput);
            /*-- 对新画布进行绘画 --*/
            drawmap(2);
            $(this).children("a").attr("href", document.getElementById("downloaddrawing").toDataURL("image/png"));
            var campaignname = $("#campaignselect").find("option:selected").text();
            var missionname = $("#missionselect").find("option:selected").text();
            var othername = ($("#layerselect").parent().css("display") != "none") ? (" " + $("#layerselect").find("option:selected").text()) : "";
            $(this).children("a").attr("download",campaignname + " " + missionname + othername + ".png");
            mapwidth = 1200; mapheight = 675;
            return;
        }
        /*-- 还原功能 --*/
        else if(setid == "sredraw"){
            xmove = 0; ymove = 0; scale = 1;
            drawmap(); return;
        }
        /*-- 所有btn的基本功能 --*/
        if(setmessage[setid] == 0){
            setmessage[setid] = 1;
            $(this).css({"background-color":"#f4c430","color":"black"});
        }else{
            setmessage[setid] = 0;
            $(this).css({"background-color":"#111111","color":"#eaeaea"});
        }

        /*-- 根据需要具备的不同功能 0为当前关闭 1为当前开启 --*/
        switch(setid){
            case "smaphide": {
                if(setmessage.smaphide == 0) $("#missionmap").slideDown("fast");
                else{
                    $("#missionmap").slideUp("fast");
                    if(setmessage.sbuildtable == 1) $("#sbuildtable").click();
                    if(setmessage.sporttable == 1) $("#sporttable").click();
                    if(setmessage.sspotsign == 1) $("#sspotsign").click();
                }
            } break;
            case "sbuildtable": {
                if(setmessage.sbuildtable == 0) $("#buildingshow").slideUp("fast");
                else $("#buildingshow").slideDown("fast");
            } break;
            case "sporttable": {
                if(setmessage.sporttable == 0) $("#teleportshow").slideUp("fast");
                else $("#teleportshow").slideDown("fast");
            } break;
            case "sspotsign": {
                if(setmessage.sspotsign == 0) $("#spotsign").slideUp("fast");
                else $("#spotsign").slideDown("fast");
            } break;
            case "senemypile": {
                enemypile();
            }
            default: break;
        }

        drawmap();
    });
}

/*-- 同组敌人的堆叠 --*/
function enemypile(){
    if(setmessage.senemypile == 0) {
        $(".cellacap").css("display", "table-cell");
        $(".cellbcap").css("display", "none");
        $(".cella").css("display", "table-cell");
        $(".cellb").css("display", "none");
        $(".missionline").css("display","table-row");
    }else {
        $(".cellacap").css("display", "none");
        $(".cellbcap").css("display", "table-cell");
        $(".cella").css("display", "none");
        $(".cellb").css("display", "table-cell");

        var teamnum = [];
        var missionlines = $(".missionline");
        for(var k = 0; k < missionlines.length; k++){
            teamnum.push($($(missionlines[k]).children("td")[0]).html());
        }
        for(k in missionlines){
            for(var z = 0; z < k; z++){
                if(teamnum[k] == teamnum[z]){
                    $(missionlines[k]).css("display", "none");
                }
            }
        }
    }
}

function spotsigncreat(){
    /*-- 特殊标点 12ff00 d800ff 00ffea ccff00 --*/
    var output = `<div id="mapredraw" class="mapsignbtn" style="display:inline-block; user-select:none; border:1px #eaeaea solid; padding:5px 10px; cursor:pointer;">${UI_TEXT["map_highlight_redraw"]}</div>
                <div id="mapclear" class="mapsignbtn" style="display:inline-block; user-select:none; border:1px #eaeaea solid; padding:5px 10px; cursor:pointer;">${UI_TEXT["map_highlight_clear"]}</div>
                <input type="text" id="spotsign1" name="spotsign1" style="border:none; padding:10px; margin:3px 3px; background-color:#12ff00; color:#111111;"/>
                <input type="text" id="spotsign2" name="spotsign2" style="border:none; padding:10px; margin:3px 3px; background-color:#d800ff; color:#111111;"/>
                <input type="text" id="spotsign3" name="spotsign3" style="border:none; padding:10px; margin:3px 3px; background-color:#00ffea; color:#111111;"/>
                <input type="text" id="spotsign4" name="spotsign4" style="border:none; padding:10px; margin:3px 3px; background-color:#ccff00; color:#111111;"/>`;
    $("#spotsign").html(output);
    $("#spotsign").css("display", "none");

    $(".mapsignbtn").mouseover(function(){
        $(this).css({"border":"1px #f4c430 solid","padding":"5px 10px"});
    });
    $(".mapsignbtn").mouseout(function(){
        $(this).css({"border":"1px #eaeaea solid","padding":"5px 10px"});
    });
    $(".mapsignbtn").mousedown(function(){
        $(this).css({"background-color":"#f4c430aa","color":"black"});
    });
    $(".mapsignbtn").mouseup(function(){
        $(this).css({"background-color":"#111111","color":"#eaeaea"});
    });

    $("#mapredraw").click(function(){ drawmap();});
    $("#mapclear").click(function(){
        $("#spotsign1").val("");
        $("#spotsign2").val("");
        $("#spotsign3").val("");
        $("#spotsign4").val("");
        theaicontent = 0;
        drawmap();
    });
}

function firstcreat(){
    var output = `<div id="loadtips" style="padding:20px; font-size:130%; display:block; border:1px solid #eaeaea; width:1180px; margin:20px 0px;">文件加载进度:0/12</div>
                <div id="campaignchose"></div>
                <div id="mapsetdiv"></div>
                <div id="missionmap" style="max-width:1220px; border:1px #ffffff99 solid;"></div>
                <div id="missioninfo" style="width: 100%;"></div>
                <div id="spotsign"></div>
                <div id="teleportshow"></div>
                <div id="buildingshow"></div>
                <div id="missionshow"></div>
                <div id="enemychose"></div>
                <div id="enemyshow"></div>
                <div id="enemyposition" style="overflow-x:scroll;"></div>
                <div id="otherthing"></div>
                <div id="downloaddraw"></div>`;

    $("#thisdiv").html(output);
}

})();
