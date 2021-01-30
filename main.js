(function(){
  
var config = {
  langCode: "en",
  dataSource: "cn"
};
// TODO add TC, KR, JP
var fontList = "Noto Sans, Noto Sans SC, Arial";

var loadstate = 0;

var Enemy_team;
var Enemy_in_team;
var Enemy_standard_attribute;
var Spot;
var Theater_area;

var Mission;
var Enemy_charater_type;
var Ally_team;
var Building;
var Team_ai;
var Mission_targettrain_enemy;

var Mission_txt;
var Enemy_charater_type_txt;
var Ally_team_txt;
var Building_txt;
var Gun_txt;
var Team_ai_txt;
var Mission_targettrain_enemy_txt;
var Special_spot_config_txt;

var UI_TEXT = {};
var INSTRUCTIONS = "";

var xmlhttp_Spot = new XMLHttpRequest();
xmlhttp_Spot.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    Spot = JSON.parse(this.responseText);
    loadstate++;
  }
};
xmlhttp_Spot.open("GET", `./data/${config.dataSource}/Spot.json`, true);
xmlhttp_Spot.send();

var xmlhttp_in_team = new XMLHttpRequest();
xmlhttp_in_team.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    Enemy_in_team = JSON.parse(this.responseText);
    loadstate++;
  }
};
xmlhttp_in_team.open("GET", `./data/${config.dataSource}/Enemy_in_team.json`, true);
xmlhttp_in_team.send();

var xmlhttp_standard_attribute = new XMLHttpRequest();
xmlhttp_standard_attribute.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    Enemy_standard_attribute = JSON.parse(this.responseText);
    loadstate++;
  }
};
xmlhttp_standard_attribute.open("GET", `./data/${config.dataSource}/Enemy_standard_attribute.json`, true);
xmlhttp_standard_attribute.send();

var xmlhttp_team = new XMLHttpRequest();
xmlhttp_team.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    Enemy_team = JSON.parse(this.responseText);
    loadstate++;
  }
};
xmlhttp_team.open("GET", `./data/${config.dataSource}/Enemy_team.json`, true);
xmlhttp_team.send();

var xmlhttp_Theater_area = new XMLHttpRequest();
xmlhttp_Theater_area.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    Theater_area = JSON.parse(this.responseText);
    loadstate++;
  }
};
xmlhttp_Theater_area.open("GET", `./data/${config.dataSource}/Theater_area.json`, true);
xmlhttp_Theater_area.send();

var xmlhttp_Building = new XMLHttpRequest();
xmlhttp_Building.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    Building = JSON.parse(this.responseText);
    loadstate++;
  }
};
xmlhttp_Building.open("GET", `./data/${config.dataSource}/Building.json`, true);
xmlhttp_Building.send();

var xmlhttp_Mission = new XMLHttpRequest();
xmlhttp_Mission.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    Mission = JSON.parse(this.responseText);
    loadstate++;
  }
};
xmlhttp_Mission.open("GET", `./data/${config.dataSource}/Mission.json`, true);
xmlhttp_Mission.send();

var xmlhttp_charater_type = new XMLHttpRequest();
xmlhttp_charater_type.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    Enemy_charater_type = JSON.parse(this.responseText);
    loadstate++;
  }
};
xmlhttp_charater_type.open("GET", `./data/${config.dataSource}/Enemy_character_type.json`, true);
xmlhttp_charater_type.send();

var xmlhttp_Ally_team = new XMLHttpRequest();
xmlhttp_Ally_team.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    Ally_team = JSON.parse(this.responseText);
    loadstate++;
  }
};
xmlhttp_Ally_team.open("GET", `./data/${config.dataSource}/Ally_team.json`, true);
xmlhttp_Ally_team.send();

var xmlhttp_Team_ai = new XMLHttpRequest();
xmlhttp_Team_ai.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    Team_ai = JSON.parse(this.responseText);
    loadstate++;
  }
};
xmlhttp_Team_ai.open("GET", `./data/${config.dataSource}/Team_ai.json`, true);
xmlhttp_Team_ai.send();

var xmlhttp_Mission_targettrain_enemy = new XMLHttpRequest();
xmlhttp_Mission_targettrain_enemy.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    Mission_targettrain_enemy = JSON.parse(this.responseText);
    loadstate++;
  }
};
xmlhttp_Mission_targettrain_enemy.open("GET", `./data/${config.dataSource}/Mission_targettrain_enemy.json`, true);
xmlhttp_Mission_targettrain_enemy.send();

var xmlhttp_Building_txt = new XMLHttpRequest();
xmlhttp_Building_txt.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    Building_txt = this.responseText;
    loadstate++;
  }
};
xmlhttp_Building_txt.open("GET", `./text/${config.langCode}/building.txt`, true);
xmlhttp_Building_txt.send();

var xmlhttp_Gun_txt = new XMLHttpRequest();
xmlhttp_Gun_txt.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    Gun_txt = this.responseText;
    loadstate++;
  }
};
xmlhttp_Gun_txt.open("GET", `./text/${config.langCode}/gun.txt`, true);
xmlhttp_Gun_txt.send();

var xmlhttp_Mission_txt = new XMLHttpRequest();
xmlhttp_Mission_txt.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    Mission_txt = this.responseText;
    loadstate++;
  }
};
xmlhttp_Mission_txt.open("GET", `./text/${config.langCode}/mission.txt`, true);
xmlhttp_Mission_txt.send();

var xmlhttp_Enemy_charater_type_txt = new XMLHttpRequest();
xmlhttp_Enemy_charater_type_txt.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    Enemy_charater_type_txt = this.responseText;
    loadstate++;
  }
};
xmlhttp_Enemy_charater_type_txt.open("GET", `./text/${config.langCode}/enemy_character_type.txt`, true);
xmlhttp_Enemy_charater_type_txt.send();

var xmlhttp_Ally_team_txt = new XMLHttpRequest();
xmlhttp_Ally_team_txt.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    Ally_team_txt = this.responseText;
    loadstate++;
  }
};
xmlhttp_Ally_team_txt.open("GET", `./text/${config.langCode}/ally_team.txt`, true);
xmlhttp_Ally_team_txt.send();

var xmlhttp_Team_ai_txt = new XMLHttpRequest();
xmlhttp_Team_ai_txt.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    Team_ai_txt = this.responseText;
    loadstate++;
  }
};
xmlhttp_Team_ai_txt.open("GET", `./text/${config.langCode}/team_ai.txt`, true);
xmlhttp_Team_ai_txt.send();

var xmlhttp_Mission_targettrain_enemy_txt = new XMLHttpRequest();
xmlhttp_Mission_targettrain_enemy_txt.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    Mission_targettrain_enemy_txt = this.responseText;
    loadstate++;
  }
};
xmlhttp_Mission_targettrain_enemy_txt.open("GET", `./text/${config.langCode}/mission_targettrain_enemy.txt`, true);
xmlhttp_Mission_targettrain_enemy_txt.send();

var xmlhttp_Special_spot_config_txt = new XMLHttpRequest();
xmlhttp_Special_spot_config_txt.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    Special_spot_config_txt = this.responseText;
    loadstate++;
  }
};
xmlhttp_Special_spot_config_txt.open("GET", `./text/${config.langCode}/special_spot_config.txt`, true);
xmlhttp_Special_spot_config_txt.send();

var xmlhttp_UI_TEXT = new XMLHttpRequest();
xmlhttp_UI_TEXT.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    UI_TEXT = JSON.parse(this.responseText);
    loadstate++;
  }
};
xmlhttp_UI_TEXT.open("GET", `./text/${config.langCode}/ui_text.json`, true);
xmlhttp_UI_TEXT.send();

var xmlhttp_INSTRUCTIONS = new XMLHttpRequest();
xmlhttp_INSTRUCTIONS.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    INSTRUCTIONS = this.responseText;
    loadstate++;
  }
};
xmlhttp_INSTRUCTIONS.open("GET", `./text/${config.langCode}/instructions.html`, true);
xmlhttp_INSTRUCTIONS.send();

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
      Building[i].name = `[${Building[i].name}]`;
    }
  }

  for (i in Mission) {
    var namepos = Mission_txt.indexOf(Mission[i].name);
    var namestr = namepos !== -1 ? Mission_txt.slice(namepos + Mission[i].name.length + 1, Mission_txt.indexOf("\n", namepos)).trim().replace("//c", UI_TEXT["comma"]) : null;
    if (namestr && !namestr.match(/(?:don't|do not) translate/i)) {
      Mission[i].name = namestr;
    } else {
      Mission[i].name = `[${Mission[i].name}]`;
    }
  }

  for(i in Enemy_charater_type) {
    var namepos = Enemy_charater_type_txt.indexOf(Enemy_charater_type[i].name);    
    var namestr = namepos !== -1 ? Enemy_charater_type_txt.slice(namepos + Enemy_charater_type[i].name.length + 1, Enemy_charater_type_txt.indexOf("\n", namepos) - 1).trim().replace("//c", UI_TEXT["comma"]) : null;
    if (namestr) {
      Enemy_charater_type[i].name = namestr;
    } else if (Enemy_charater_type[i].code) {
      // CHANGE FROM GFWIKI: When dataSource=CN and langCode=EN, for enemy characters without names,
      //     if they have a codename, then display the codename in square brackets.
      Enemy_charater_type[i].name = `[${Enemy_charater_type[i].code}]`;
    } else {
      Enemy_charater_type[i].name = `[${Enemy_charater_type[i].name}]`;
    }
  }

  for (i in Ally_team) {
    var namepos = Ally_team_txt.indexOf(Ally_team[i].name);
    var namestr = namepos !== -1 ? Ally_team_txt.slice(namepos + Ally_team[i].name.length + 1, Ally_team_txt.indexOf("\n", namepos) - 1).trim().replace("//c", UI_TEXT["comma"]) : null;
    if (namestr) {
      Ally_team[i].name = namestr;
    } else {
      // CHANGE FROM GFWIKI: Team names have table IDs in the format of "ally_team-10000026", even though these
      //     teams can be enemies to the player. If the map just displayed "[ally_team-10000026]" as a placeholder,
      //     that might confuse people who assume that that team is allied with them. Here, we just truncate the "ally_"
      //     part and display "[team-10000026]".
      var teamname = Ally_team[i].name.match(/team-\d+/);
      if (teamname.length) {
        Ally_team[i].name = `[${teamname[0]}]`;
      }
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
      Mission_targettrain_enemy[i].name = `[${Mission_targettrain_enemy[i].name}]`;
    }

    var despos = Mission_targettrain_enemy_txt.indexOf(Mission_targettrain_enemy[i].des);
    var desstr = despos !== -1 ? Mission_targettrain_enemy_txt.slice(despos + Mission_targettrain_enemy[i].des.length + 1, Mission_targettrain_enemy_txt.indexOf("\n", despos) - 1).trim() : null;
    if (desstr) {
      Mission_targettrain_enemy[i].des = desstr.replace("//c", UI_TEXT["comma"]);
    } else {
      Mission_targettrain_enemy[i].des = "";
    }
  }
}

firstcreat();
loadjudge();
function loadjudge(){
  $("#loadtips").html(`Loading/文件加载进度: ${loadstate} / 21`);
  if(loadstate < 21) {
    setTimeout(function(){loadjudge();}, 100);
  } else {
    trans();
    $("#loadtips").hide();
    $("#otherthing").html(INSTRUCTIONS);

    missioncreat();
    mapsetcreat();
    examplecreate();
    spotsigncreat();
    enemyselectcreat();

    updatemap();
    enemydisplay(221);
  }
}

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
var theaicontent = 0;

var eteamspot = [];

/*-- 下载 sdownload  重置 sredraw  隐藏 smaphide  图例 sexample
    敌人 smapenemy  建筑 smapbuild  类型 smaptype  颜色 smapcolor  标号 smapspotn  逻辑 smapenemyai
    建筑表格 sbuildtable  传送表格 sporttable  点位标记 sspotsign  同组堆叠 senemypile  --*/
var setmessage = {sdownload:0, sredraw:0, smaphide:0, sexample:0, smapenemy:1, smapbuild:1, smaptype:1, smapcolor:1, smapspotn:1, smapenemyai:1, sbuildtable:1, sporttable:1, sspotsign:0, senemypile:0};

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
    case -28: return 3024;
    // -29 is DD+
    // -30 is Rabbit Hunt rerun
    // Isomer
    case -31: return 3031;
    // VA-11 HALL-A
    case -32: return 4032;
    // SC
    case -33: return 3033;
    // Halloween mini-event 1
    case -34: return 5034;
    // Christmas mini-event
    case -35: return 5035;
    // PL
    case -36: return 3036;
    // Valentine's mini-event
    case -37: return 5037;
    // GSG
    case -38: return 4038;
    // -39 is Singularity+
    // Summer mini-event
    case -40: return 5040;
    // DR
    case -41: return 3041;
    // Halloween mini-event 2
    case -42: return 5042;
    // The Division
    case -43: return 4043;
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
      var place = [0, UI_TEXT["theater_nonboss"], UI_TEXT["theater_nonboss"], UI_TEXT["theater_boss"], UI_TEXT["theater_nonboss"], UI_TEXT["theater_nonboss"], UI_TEXT["theater_boss"], UI_TEXT["theater_nonboss"], UI_TEXT["theater_boss"]];
      for(var i = 1; i < 5; i++){
          for(var j = 1; j < 9; j++){
              missionOptions.push({
                value: (campaign - 6000)*100 + i*10 + j,
                innerHTML: area[i] + " " + j + " " + place[j]
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
          if (Mission[i].endless_mode == 1 || Mission[i].endless_mode == 2) innerHTML += `[${UI_TEXT["endless_map"]}] `;
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
              missionOptions.push({
                value: Number(Mission[i].id),
                innerHTML: Mission[i].sub + " " + Mission[i].name.replace("//n", " ")
              });
          }
      }
  }
  
  else if(campaign == 9999) {
      for (i in Mission) {
          /*-- 去除剧情关卡 --*/
          if(Mission[i].special_type == 8 || Mission[i].special_type == 9) continue;
          if(Mission[i].campaign >= -43) continue;
          
          missionOptions.push({
            value: Number(Mission[i].id),
            innerHTML: Mission[i].campaign + "-" + Mission[i].sub + " " + ((Mission[i].endless_mode == 1 || Mission[i].endless_mode == 2) ? `[${UI_TEXT["endless_map"]}] ` : "") + Mission[i].name.replace("//n", " ")
          });
      }
    
  }
  return missionOptions;
}

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
  
  if(campaign == 2008){ traindisplay(); return;}
  else if(campaign >= 6000 && campaign < 7000){ theaterdisplay(); return;}

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
    missiondraw.onmousedown = function (event) {
        dragging = true;
        posa = windowToCanvas(event.clientX, event.clientY);
    };
    missiondraw.onmousemove = function (event) {
        if(dragging){
            posb = windowToCanvas(event.clientX, event.clientY);
            var x = posb.x - posa.x, y = posb.y - posa.y;
            xmove += x;
            ymove += y;
            posa = JSON.parse(JSON.stringify(posb));
            drawmap();
        }
    };
    missiondraw.onmouseup = function () {
        dragging = false;
    };

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
        op.innerHTML = `${UI_TEXT["layer"]} ${i}`;
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
    var output = `<table id="buildingtable" class="enemydata" style="text-align:center; border:1px #f4c430cc solid; background-color:#111111; margin:4px 0px 14px 0px;" cellspacing="1">
        <thead style="display:block; background-color:#f4c430; color:black;"><tr>
        <th style="width:120px;">${UI_TEXT["building_location"]}<\/th>
        <th style="width:160px;">${UI_TEXT["building_name"]}<\/th>
        <th style="width:80px;">${UI_TEXT["building_hp"]}<\/th>
        <th style="width:140px;">${UI_TEXT["building_destruction_method"]}<\/th>
        <th style="width:100px;">${UI_TEXT["building_initial_state"]}<\/th>
        <th style="width:80px;">${UI_TEXT["building_support_range"]}<\/th>
        <th style="width:560px;">${UI_TEXT["building_notes"]}<\/th>
        <\/tr><\/thead><tbody id="Buildingbody" style="height:200px; overflow-y:scroll; display:block;">`;

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

        var thisline = `<tr class="buildingline" style="border-bottom:2px #f4c43033 solid; display:block; cursor:pointer;"><td width="120px">`;
        thisline += dspot[i].id + `<\/td><td width="160px">`;
        thisline += Building[buildnum].name + `<\/td><td width="80px">`;
        thisline += Building[buildnum].defender + `<\/td><td width="140px">`;
        thisline += Building[buildnum].is_destroy.replace("0", UI_TEXT["building_indestructible"]).replace("1", UI_TEXT["building_destructible_by_hoc"]).replace("2", UI_TEXT["building_destructible_by_stepping_on"]) + `<\/td><td width="100px">`;
        // CHANGE FROM GFWIKI: initial_state is a string in GFWiki's data file but is a number in GFLMap's files.
        thisline += (Building[buildnum].initial_state == 0 ? UI_TEXT["building_state_open"] : /* initial_state==-1 */UI_TEXT["building_state_closed"]) + `<\/td><td width="80px">`;
        thisline += Building[buildnum].battle_assist_range + `<\/td><td width="544px">`;
        thisline += ((buildsigndes) ? buildsigndes : UI_TEXT["building_notes_other"]) + "<\/td><\/tr>";

        spotinfo[i].sbuild = Building[buildnum].name;
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
    var output = `<table id="teleporttable" class="enemydata" style="text-align:center; border:1px #f4c430cc solid; background-color:#111111; margin:4px 0px 14px 0px;" cellspacing="1">
                <thead style="display:block; background-color:#f4c430; color:black;"><tr>
                <th style="width:100px;">${UI_TEXT["portal_source_layer"]}<\/th>
                <th style="width:100px;">${UI_TEXT["portal_source_zone"]}<\/th>
                <th style="width:100px;">${UI_TEXT["portal_source_location"]}<\/th>
                <th style="width:100px;">${UI_TEXT["portal_to"]}<\/th>
                <th style="width:100px;">${UI_TEXT["portal_dest_layer"]}<\/th>
                <th style="width:100px;">${UI_TEXT["portal_dest_zone"]}<\/th>
                <th style="width:100px;">${UI_TEXT["portal_dest_location"]}<\/th>
                <th style="width:520px;"><\/th><\/tr><\/thead><tbody id="teleportbody" style="height:200px; overflow-y:scroll; display:block;">`;

    telespot = [{}];
    for(i in mspot){
        if(!(mspot[i].auto_teleport)) continue;

        var thisline = `<tr class="teleportline" style="border-bottom:2px #f4c43033 solid; display:block; cursor:pointer;"><td width="100px">`;

        /*-- from this to …… --*/
        if(mspot[i].auto_teleport.indexOf("0:") == 0){
            var nextmap, nextpack;
            var nextid = Number(mspot[i].auto_teleport.replace("0:", ""));
            for(j in mspot) if(mspot[j].id == nextid){
                nextmap = mspot[j].map_num;
                nextpack = mspot[j].package;
            }

            thisline += `${UI_TEXT["layer"]} ${mspot[i].map_num} <\/td><td width="100px">`;
            thisline += mspot[i].package + `<\/td><td width="100px">`;
            thisline += mspot[i].id + `<\/td><td width="100px">TO<\/td><td width="100px">`;

            thisline += `${UI_TEXT["layer"]} ${nextmap} <\/td><td width="100px">`;
            thisline += nextpack + `<\/td><td width="100px">`;
            thisline += nextid + `<\/td><td width="500px"><\/td><\/tr>`;

            var existsign = 0;
            for(j in telespot) if(Number(mspot[i].id) == telespot[j].a && nextid == telespot[j].b){ existsign = 1; break;}
            if(existsign) continue;
            telespot.push({a:Number(mspot[i].id), b:nextid});
        }

        /*-- from …… to this --*/
        else if(mspot[i].auto_teleport.indexOf(":0") != -1){
            var nextmap, nextpack;
            var nextid = Number(mspot[i].auto_teleport.replace(":0", ""));
            for(j in mspot) if(mspot[j].id == nextid){
                nextmap = mspot[j].map_num;
                nextpack = mspot[j].package;
            }

            thisline += `${UI_TEXT["layer"]} ${nextmap} <\/td><td width="100px">`;
            thisline += nextpack + `<\/td><td width="100px">`;
            thisline += nextid + `<\/td><td width="100px">TO<\/td><td width="100px">`;

            thisline += `${UI_TEXT["layer"]} ${mspot[i].map_num} <\/td><td width="100px">`;
            thisline += mspot[i].package + `<\/td><td width="100px">`;
            thisline += mspot[i].id + `<\/td><td width="500px"><\/td><\/tr>`;

            var existsign = 0;
            for(j in telespot) if(nextid == telespot[j].a && Number(mspot[i].id) == telespot[j].b){ existsign = 1; break;}
            if(existsign) continue;
            telespot.push({a:nextid, b:Number(mspot[i].id)});
        }

        output += thisline;
    }

    $("#teleportshow").css("display", "none");
    if(setmessage.sporttable == 1 && telespot.length > 1) $("#teleportshow").css("display", "block");
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

function missiondisplay(){
    /*-- 全局变量清零 --*/
    xmove = 0; ymove = 0;
    xcen = 0; ycen = 0;
    scale = 1;
    posa={}; posb={};
    dragging = false;

    spotinfo = [];
    eteamspot = [];

    var output = `<table id="Missiontable" class="enemydata" style="text-align:center; border:1px #f4c430cc solid; background-color:#111111; margin:4px 0px 14px 0px;" cellspacing="1">
        <thead style="display:block; background-color:#f4c430; color:black;"><tr>
        <th style="width:100px;">${UI_TEXT["team_id"]}</th>
        <th style="width:160px;">${UI_TEXT["team_leader"]}</th>
        <th style="width:100px;">${UI_TEXT["team_alignment"]}</th>
        <th style="width:80px;">${UI_TEXT["team_ai"]}</th>
        <th style="width:100px;">${UI_TEXT["team_ce"]}</th>
        <th style="width:490px;">${UI_TEXT["team_composition"]}</th>
        <th class="cellacap" style="width:120px; display:table-cell;">${UI_TEXT["team_location"]}</th>
        <th class="cellbcap" style="width:120px; display:none;">${UI_TEXT["team_count"]}</th>
        <th style="width:50px;">${UI_TEXT["team_other"]}</th>
        </tr></thead><tbody id="Missionbody" style="height:300px; overflow-y:scroll; display:block;">`;

    /*-- 路径点的敌人站位 --*/
    for(var i = 0; i < dspot.length; i++){
        var enemy_team_id;
        var ally_name = "";
        /*-- 如果是ally，要多套一层寻找enemyid --*/
        if (Number(dspot[i]["enemy_team_id"])) {
          enemy_team_id = Number(dspot[i]["enemy_team_id"]);
        } else if(Number(dspot[i]["ally_team_id"])) {
          var ally_tar;
          for (j in Ally_team) {
            if (Ally_team[j].id == Number(dspot[i]["ally_team_id"])) {
              ally_tar = j; break;
            }
          }
          if (Ally_team[ally_tar].enemy_team_id) {
            enemy_team_id = Ally_team[ally_tar].enemy_team_id;
            ally_name = Ally_team[ally_tar].name;
          } else {
            spotinfo.push({sename:0, sally:0, sefect:0, seai:0, sbuild:0});
            continue;
          }
        } else if (dspot[i]["hostage_info"] && dspot[i]["hostage_info"].match(/[0-9]+,[1-5]/)) {
          const [doll_id, hp] = dspot[i]["hostage_info"].split(",");
          const doll_name_match = Gun_txt.match(`(gun-1[0-9]*${doll_id},)(.*)`);
          const doll_name = doll_name_match ? doll_name_match[2] : `[${doll_id}]`;
          spotinfo.push({sename:0, sally:0, sefect:0, seai:0, sbuild:0, hostage_text: `[${UI_TEXT["map_hostage"]}] ${doll_name} (${hp} HP)`});
          continue;
        } else {
          spotinfo.push({sename:0, sally:0, sefect:0, seai:0, sbuild:0});
          continue;
        }

        var enemy_leader;
        var enemy_ai_num;
        var enemy_ai_con;
        var efect = 0;
        for (j in Enemy_team) {
            if (Enemy_team[j]["id"] != enemy_team_id) continue;
            /*-- 效能欺诈 --*/
            if (Enemy_team[j].effect_ext != 0) efect = Enemy_team[j].effect_ext;
            enemy_leader = Enemy_team[j]["enemy_leader"];
            enemy_ai_num = Enemy_team[j]["ai"];
            enemy_ai_con = Enemy_team[j]["ai_content"];
        }

        var leader_name;
        for (j in Enemy_charater_type) {
            if(Enemy_charater_type[j]["id"] != enemy_leader) continue;
            leader_name = Enemy_charater_type[j]["name"];
        }

        /*-- enemyai 敌方行动逻辑 --*/
        var enemy_ai;
        if(enemy_ai_num == 0) for(j in Mission) if(Mission[j].id == $("#missionselect").val()) {enemy_ai_num = Mission[j].enemy_ai_type; break;}
        for(j in Team_ai) if(enemy_ai_num == Team_ai[j].ai_type) {enemy_ai = Team_ai[j].name; break;}

        /*-- 利用数组存储效能数据以优化计算 --*/
        spotinfo.push({sename:leader_name, sally:((ally_name) ? ally_name : 0), sefect:((efect == 0) ? efectcal(enemy_team_id) : efect), seai:enemy_ai, sbuild:0});
        eteamspot.push(enemy_team_id);

        var aioutput = enemy_ai + ((enemy_ai == UI_TEXT["team_ai_alert"]) ? ("[" + enemy_ai_con + "]") : "");

        var thisline = `<tr class="missionline" style="border-bottom:2px #f4c43033 solid; display:block; cursor:pointer;"><td width="100px">`;
        thisline += enemy_team_id + `<\/td><td width="160px">`;
        thisline += leader_name + `<\/td><td width="100px">`;
        thisline += ((ally_name) ? ally_name : UI_TEXT["team_alignment_enemy"]) + `<\/td><td width="80px">`;
        thisline += aioutput + `<\/td><td width="100px">`;
        thisline += ((efect == 0) ? efectcal(enemy_team_id) : efect) + `<\/td><td width="490px">`;
        thisline += enemyoutcal(enemy_team_id) + `<\/td><td class="cella" width="120px" style="display:table-cell;">`;
        thisline += Number(dspot[i]["id"]) + `<\/td><td class="cellb" width="120px" style="display:none;">`;
        thisline += "team_num" + `<\/td><td width="34px">`;
        thisline += "<\/td><\/tr>";

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
        if(setmessage.sspotsign == 1) $("#spotsign1").val(Number($($(this).children("td")[6]).html()));
        if($($(this).children("td")[3]).html() == UI_TEXT["team_ai_patrol"]){
            for(i in Enemy_team) if(Enemy_team[i].id == $($(this).children("td")[0]).html()) theaicontent = "巡逻" + Enemy_team[i].ai_content;
        } else if($($(this).children("td")[3]).html().indexOf(UI_TEXT["team_ai_alert"]) != -1){
            for(i in Enemy_team) if(Enemy_team[i].id == $($(this).children("td")[0]).html()) theaicontent = "警戒" + Enemy_team[i].ai_content;
        } else theaicontent = 0;
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
        /*-- 路径点的归属颜色 --*/
        con.lineWidth= "1";
        con.strokeStyle = "#111111";
        var spotcolor = "#eaeaea";
        /*-- 路径点的归属颜色:显示 --*/
        if(setmessage.smapcolor == 1){
            switch(Number(dspot[i].belong)){
                case 1: spotcolor = "#03a9f4";break;
                case 2: spotcolor = "#f44336";break;
                case 3: spotcolor = "#f5f5f5";break;
                case 0: spotcolor = "#ffc107";break;
                default: break;
            }
        }
        /*-- 特殊标点 12ff00 d800ff 00ffea ccff00 --*/
        if(setmessage.sspotsign == 1){
            if($("#spotsign1").val() && dspot[i].id == $("#spotsign1").val()) spotcolor = "#12ff00";
            else if($("#spotsign2").val() && dspot[i].id == $("#spotsign2").val()) spotcolor = "#d800ff";
            else if($("#spotsign3").val() && dspot[i].id == $("#spotsign3").val()) spotcolor = "#00ffea";
            else if($("#spotsign4").val() && dspot[i].id == $("#spotsign4").val()) spotcolor = "#ccff00";
        }
        con.fillStyle = spotcolor;
        /*-- 特殊标点 的特殊显示 --*/
        if(setmessage.sspotsign == 1 && (dspot[i].id == $("#spotsign1").val() || dspot[i].id == $("#spotsign2").val() || dspot[i].id == $("#spotsign3").val() || dspot[i].id == $("#spotsign4").val())){
            con.beginPath();
            con.rect(coorchange(1, Number(dspot[i].coordinator_x), x_min) - coorchange(3, 140), coorchange(2, Number(dspot[i].coordinator_y), y_min) - coorchange(3, 15), coorchange(3, 280), coorchange(3, 30));
            con.fill();
            con.stroke();
            con.beginPath();
            con.rect(coorchange(1, Number(dspot[i].coordinator_x), x_min) - coorchange(3, 15), coorchange(2, Number(dspot[i].coordinator_y), y_min) - coorchange(3, 140), coorchange(3, 30), coorchange(3, 280));
            con.fill();
            con.stroke();
        }
        con.beginPath();
        con.arc(coorchange(1, Number(dspot[i].coordinator_x), x_min), coorchange(2, Number(dspot[i].coordinator_y), y_min), coorchange(3, 100), 0, 2*Math.PI);
        con.fill();
        con.stroke();

        /*-- 路径点的类型 --*/
        var spottype = 2;
        if(setmessage.smaptype == 1){
            if(Number(dspot[i].special_eft))spottype = 22;
            else if(Number(dspot[i].random_get))spottype = 23;
            else if(dspot[i].active_cycle)spottype = 21;
            else spottype = Number(dspot[i]["type"]);
            if(dspot[i].active_cycle){
                con.lineWidth= String(coorchange(3, 3));
                con.fillStyle = "#111111";
                con.strokeStyle = "#111111";
                con.textAlign = "left";
                con.font = String(coorchange(3, 30)) + `px bold ${fontList}`;
                con.beginPath();
                con.strokeText(dspot[i].active_cycle.replace(",", "/").replace("99/1", "-/-"), coorchange(1, Number(dspot[i].coordinator_x), x_min) - coorchange(3, 75), coorchange(2, Number(dspot[i].coordinator_y) , y_min) - coorchange(3, 30));
                con.fillText(dspot[i].active_cycle.replace(",", "/").replace("99/1", "-/-"), coorchange(1, Number(dspot[i].coordinator_x), x_min) - coorchange(3, 75), coorchange(2, Number(dspot[i].coordinator_y), y_min) - coorchange(3, 30));
                con.stroke();
            }
        }
        spotTypeDraw(spottype, coorchange(1, Number(dspot[i].coordinator_x), x_min), coorchange(2, Number(dspot[i].coordinator_y), y_min), func);
    }

    for(i in dspot){
        /*-- 敌方名称和效能的展示 --*/
        con.fillStyle = "#eaeaea";
        if((Number(dspot[i]["enemy_team_id"]) || Number(dspot[i]["ally_team_id"]) || dspot[i]["hostage_info"]) && (setmessage.smapenemy == 1)){
            con.lineWidth= String(coorchange(3, 12));
            con.font = String(coorchange(3, 50)) + `px bold ${fontList}`;
            con.textAlign = "center";
            con.beginPath();
            let enemyTitle;
            if (spotinfo[i]["hostage_text"]) {
              enemyTitle = spotinfo[i]["hostage_text"];
            } else {
              enemyTitle = ((spotinfo[i]["sally"]) ? ("[" + spotinfo[i]["sally"] + "] ") : "") + spotinfo[i]["sename"];
            }
            con.strokeText(enemyTitle, coorchange(1, Number(dspot[i].coordinator_x), x_min), coorchange(2, Number(dspot[i].coordinator_y), y_min) + coorchange(3, 125));
            con.fillText(enemyTitle, coorchange(1, Number(dspot[i].coordinator_x), x_min), coorchange(2, Number(dspot[i].coordinator_y), y_min) + coorchange(3, 125));
            con.stroke();

            if (!spotinfo[i]["hostage_text"]) {
              con.lineWidth= String(coorchange(3, 8));
              con.font = String(coorchange(3, 30)) + `px bold ${fontList}`;
              con.textAlign = "center";
              con.beginPath();
              const enemySubtitle = "[" + spotinfo[i]["seai"] + "] " + spotinfo[i]["sefect"];
              con.strokeText(enemySubtitle, coorchange(1, Number(dspot[i].coordinator_x), x_min), coorchange(2, Number(dspot[i].coordinator_y), y_min) + coorchange(3, 165));
              con.fillText(enemySubtitle, coorchange(1, Number(dspot[i].coordinator_x), x_min), coorchange(2, Number(dspot[i].coordinator_y), y_min) + coorchange(3, 165));
              con.stroke();
            }
        }

        /*-- 建筑名称的展示 --*/
        if((Number(dspot[i]["building_id"])) && (setmessage.smapbuild == 1)){
            con.lineWidth= String(coorchange(3, 12));
            con.font = String(coorchange(3, 50)) + `px bold ${fontList}`;
            con.textAlign = "center";
            con.beginPath();
            con.strokeText(spotinfo[i].sbuild, coorchange(1, Number(dspot[i].coordinator_x), x_min), coorchange(2, Number(dspot[i].coordinator_y), y_min) - coorchange(3, 90));
            con.fillText(spotinfo[i].sbuild, coorchange(1, Number(dspot[i].coordinator_x), x_min), coorchange(2, Number(dspot[i].coordinator_y), y_min) - coorchange(3, 90));
            con.stroke();
        }

        /*-- 路径点的标号 --*/
        con.textAlign="left";
        if(setmessage.smapspotn == 1){
            con.lineWidth= String(coorchange(3, 8));
            con.font = String(coorchange(3, 30)) + `px bold ${fontList}`;
            con.beginPath();
            con.strokeText(dspot[i].id, coorchange(1, Number(dspot[i].coordinator_x), x_min) + coorchange(3, 55), coorchange(2, Number(dspot[i].coordinator_y), y_min) + coorchange(3, 70));
            con.fillText(dspot[i].id, coorchange(1, Number(dspot[i].coordinator_x), x_min) + coorchange(3, 55), coorchange(2, Number(dspot[i].coordinator_y), y_min) + coorchange(3, 70));
            con.stroke();
        }
    }

    /*-- 巡逻路径 --*/
    if(setmessage.sspotsign == 1 && setmessage.smapenemyai == 1 && theaicontent != 0 && theaicontent.indexOf("巡逻") != -1){
        var content_copy = theaicontent.slice(2,theaicontent.length);
        for(var j = 1; content_copy; j++){
            var thisspotid;
            if(content_copy.indexOf(",") != -1){
                thisspotid = content_copy.slice(0, content_copy.indexOf(","));
                content_copy = content_copy.slice(content_copy.indexOf(",") + 1, content_copy.length);
            }
            else {
                thisspotid = content_copy.slice(0, content_copy.length);
                content_copy = "";
                if((thisspotid == theaicontent.slice(2, theaicontent.indexOf(",")))) break;
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
    if(setmessage.sspotsign == 1 && setmessage.smapenemyai == 1 && theaicontent != 0 && theaicontent.indexOf("警戒") != -1){
        var spotid = $("#spotsign1").val();
        var rangearray = [];
        for(i in dspot) if(dspot[i].id == spotid){ rangearray.push({id:spotid, num:i, range:0}); break;}

        var rangenum = 1;
        while(rangenum <= theaicontent.slice(2,theaicontent.length)){
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
        <thead style="display:block; background-color:#f4c430; color:black;"><tr>
        <th style="width:100px;">${UI_TEXT["target_id"]}</th>
        <th style="width:160px;">${UI_TEXT["target_name"]}</th>
        <th style="width:450px;">${UI_TEXT["target_composition"]}</th>
        <th style="width:490px;">${UI_TEXT["target_description"]}</th>
        </tr></thead><tbody id="Missionbody" style="height:300px; overflow-y:scroll; display:block;">`;

    for(i in Mission_targettrain_enemy){
        if(Mission_targettrain_enemy[i].log_fitter_id != $("#missionselect").val()) continue;
        var enemy_team_id = Mission_targettrain_enemy[i].enemy_team_id;

        var thisline = `<tr class="missionline" style="border-bottom:2px #f4c43033 solid; display:block; cursor:pointer;"><td width="100px">`;
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

function theaterdisplay(){
    /*-- 清空地图 --*/
    $("#missiondrawing")[0].getContext("2d").clearRect(0, 0, mapwidth, mapheight);
    if(setmessage.smaphide == 0) $("#smaphide").click();
    if(setmessage.sbuildtable == 1) $("#smaphide").click();
    if(setmessage.sporttable == 1) $("#smaphide").click();
    if(setmessage.sspotsign == 1) $("#smaphide").click();
    if(setmessage.senemypile == 1) $("#smaphide").click();

    var output = `<table id="Missiontable" class="enemydata" style="text-align:center; border:1px #f4c430cc solid; background-color:#111111; margin:4px 0px 14px 0px;" cellspacing="1">
        <thead style="display:block; background-color:#f4c430; color:black;"><tr>
        <th style="width:100px;">${UI_TEXT["theater_team_id"]}</th>
        <th style="width:160px;">${UI_TEXT["theater_team_leader"]}</th>
        <th style="width:100px;">${UI_TEXT["theater_team_ce"]}</th>
        <th style="width:490px;">${UI_TEXT["theater_team_composition"]}</th>
        <th style="width:60px;">${UI_TEXT["theater_team_environment"]}</th>
        <th style="width:100px;">${UI_TEXT["theater_team_wave_count"]}</th>
        <th style="width:200px;">${UI_TEXT["theater_team_other"]}</th>
        </tr></thead><tbody id="Missionbody" style="height:300px; overflow-y:scroll; display:block;">`;

    /*-- 路径点的敌人站位 --*/
    for(i in Theater_area){
        if(Theater_area[i].id != $("#missionselect").val()) continue;
        var enemystr = Theater_area[i].enemy_group + ",";

        while(enemystr){
            var enemy_team_id = enemystr.slice(0, enemystr.indexOf("-"));
            var enemy_num = enemystr.slice(enemystr.indexOf("-") + 1, enemystr.indexOf(","));
            var enemy_odd = (enemy_num.indexOf("-", 3) == -1) ? ("0~" + enemy_num[2]) : (enemy_num[4] + "~" + (Number(enemy_num[2]) + Number(enemy_num[4])));

            var enemy_leader;
            var leader_name;
            for(j in Enemy_team) if(Enemy_team[j]["id"] == enemy_team_id){ enemy_leader = Enemy_team[j]["enemy_leader"]; break;}
            for(j in Enemy_charater_type) if(Enemy_charater_type[j]["id"] == enemy_leader){ leader_name = Enemy_charater_type[j]["name"]; break;}

            var thisline = `<tr class="missionline" style="border-bottom:2px #f4c43033 solid; display:block; cursor:pointer;"><td width="100px">`;
            thisline += enemy_team_id + `<\/td><td width="160px">`;
            thisline += leader_name + `<\/td><td width="100px">`;
            thisline += efectcal(enemy_team_id) + `<\/td><td width="490px">`;
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
        enemydisplay($(this).children("td").eq(0).html());
    });
}

function efectcal(enemy_team_id){
    var efect = 0;
    for(j in Enemy_in_team){
        if(Enemy_in_team[j]["enemy_team_id"] != enemy_team_id) continue;
        var enemy_character_type_id = Number(Enemy_in_team[j].enemy_character_type_id);
        var level = Number(Enemy_in_team[j].level);

        var charatype;
        for(var k = 0; k < Enemy_charater_type.length; k++){
            if(Enemy_charater_type[k]["id"] != enemy_character_type_id) continue;
            charatype = Enemy_charater_type[k]; break;}

        var attr_number = Number(Enemy_in_team[j].number);
        var attr_pow = enemyattribute(charatype , "pow" , level);
        var attr_def_break = enemyattribute(charatype , "def_break" , level);
        var attr_rate = enemyattribute(charatype , "rate" , level);
        var attr_hit = enemyattribute(charatype , "hit" , level);
        var attr_maxlife = enemyattribute(charatype , "maxlife" , level);
        var attr_dodge = enemyattribute(charatype , "dodge" , level);
        var attr_armor = enemyattribute(charatype , "armor" , level);
        var attr_def = enemyattribute(charatype , "def" , level);
        var attr_def_percent = Number(Enemy_in_team[j].def_percent);
        /*-- 攻击：ceiling：22*扩编数*((pow + def_break*0.85) * rate/50 * hit/(hit+35) +2) --*/
        var efect_att = ceiling(22*attr_number*((attr_pow + attr_def_break*0.85) * attr_rate/50 * attr_hit/(attr_hit+35) +2));
        /*-- 防御：ceiling：0.25*(maxlife * (35+dodge)/35 * 300/(300-armor) + 100) * (def_max*2-def+1200*2)/(def_max-def+1200) /2 --*/
        var efect_def = ceiling(0.25*(bround(attr_number * attr_maxlife) * (35+attr_dodge)/35 * 300/(300-attr_armor) + 100) * (attr_def*2 - attr_def*attr_def_percent/100 + 1200*2)/(attr_def - attr_def*attr_def_percent/100 + 1200) /2);
        efect += ceiling(Number(charatype.effect_ratio) * (efect_att + efect_def));
    }
    return efect;
}

function enemyoutcal(enemy_team_id){
    let enemies = {};
    let enemies_ids_in_order = new Set();
    for(j in Enemy_in_team){
        if(Enemy_in_team[j]["enemy_team_id"] != enemy_team_id) {
          continue;
        }
        var enemy_character_type_id = Number(Enemy_in_team[j]["enemy_character_type_id"]);

        if (!(enemy_character_type_id in enemies)) {
          let enemy_character_type = Enemy_charater_type.find((e) => e.id == enemy_character_type_id);
          enemies[enemy_character_type_id] = {name: enemy_character_type ? enemy_character_type.name : "?", count: 0};
          enemies_ids_in_order.add(enemy_character_type_id);
        }
        enemies[enemy_character_type_id].count += Number(Enemy_in_team[j]["number"]);
    }
    return [...enemies_ids_in_order].map((id) => `${enemies[id].name} x${enemies[id].count}`).join(" ");
}

function enemyselectcreat(){
    var output = `<div style="display:inline-block; padding:6.5px; background:#E0E0E0; color:black; position:relative; top:1px;">${UI_TEXT["enemy_select_team_id"]}</div>
        <div class="eselect"><select id="enemyselect" name="enemyselect">`;

    for(var i = 0; i < Enemy_team.length; i++) output += "<option value=\"" + Enemy_team[i].id + "\">" + Enemy_team[i].id + "</option>";
    output += `</select></div> <input type="text" id="enemytext" name="enemytext" style="border:none; padding:10px; background-color:#e0e0e0;"/>`;

    /*-- 绘制画布 --*/
    var drawingoutput = `<canvas id="enemydrawing" width="4800px" height="300px" style="border:1px #ffffff99 solid;">Your browser does not support the HTML5 canvas tag.</canvas>`;
    $("#enemyposition").html(drawingoutput);

    $("#enemychose").html(output);
    $("#enemyselect").change(function(){
        enemydisplay(Number(this.value));
    });
    $("#enemytext").change(function(){
        for(var i = 0; i < Enemy_team.length; i++){
            if(Enemy_team[i].id == Number(this.value)){
                enemydisplay(Number(this.value));
                return;
            }
        }
        alert(UI_TEXT["enemy_select_team_nonexistent"]);
    });
}

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
    dcoordinator(1, "#f4c430", -1.7, -0.09);
    dcoordinator(1, "#f4c430", -1.7, 8.31);
    dcoordinator(1, "#f4c430", -1.7, 4.11);
    dcoordinator(1, "#f4c430", 0.7, -0.09);
    dcoordinator(1, "#f4c430", 0.7, 8.31);
    dcoordinator(1, "#f4c430", 0.7, 4.11);
    dcoordinator(1, "#f4c430", 3.1, -0.09);
    dcoordinator(1, "#f4c430", 3.1, 8.31);
    dcoordinator(1, "#f4c430", 3.1, 4.11);
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
    var output = `<table id="Eenmytable" class="enemydata" style="text-align:center; border:1px #f4c430cc solid; background-color:#111111; margin:4px 0px 14px 0px;" cellspacing="1">
        <thead style="display:block; background-color:#f4c430; color:black;"><tr>
        <th style="width:160px;">${UI_TEXT["enemy_name"]}<\/th>
        <th style="width:59px;">${UI_TEXT["enemy_links"]}<\/th>
        <th style="width:59px;">${UI_TEXT["enemy_level"]}<\/th>
        <th style="width:59px;">${UI_TEXT["enemy_hp"]}<\/th>
        <th style="width:59px;">${UI_TEXT["enemy_fp"]}<\/th>
        <th style="width:59px;">${UI_TEXT["enemy_rof"]}<\/th>
        <th style="width:59px;">${UI_TEXT["enemy_acc"]}<\/th>
        <th style="width:59px;">${UI_TEXT["enemy_eva"]}<\/th>
        <th style="width:59px;">${UI_TEXT["enemy_range"]}<\/th>
        <th style="width:59px;">${UI_TEXT["enemy_mspd"]}<\/th>
        <th style="width:59px;">${UI_TEXT["enemy_ap"]}<\/th>
        <th style="width:59px;">${UI_TEXT["enemy_armor"]}<\/th>
        <th style="width:59px;">${UI_TEXT["enemy_hp_shield"]}<\/th>
        <th style="width:59px;">${UI_TEXT["enemy_forceshield_pierce"]}<\/th>
        <th style="width:79px;">${UI_TEXT["enemy_forceshield_max"]}<\/th>
        <th style="width:79px;">${UI_TEXT["enemy_forceshield_initial_pct"]}<\/th>
        <th style="width:100px;">${UI_TEXT["enemy_coordinates"]}<\/th>
        <\/tr><\/thead><tbody id="Eenmybody" style="height:300px; overflow-y:scroll; display:block;">`;

    for(var i = 0; i < Enemy_in_team.length; i++){
        if(Enemy_in_team[i]["enemy_team_id"] != enemy_team_id) continue;
        var enemy_character_type_id = Number(Enemy_in_team[i].enemy_character_type_id);
        var level = Number(Enemy_in_team[i].level);

        /*-- 敌人type 基础属性/当前属性 --*/
        var charatype;
        for(var j = 0; j < Enemy_charater_type.length; j++){
            if(Number(Enemy_charater_type[j]["id"]) != enemy_character_type_id) continue;
            charatype = Enemy_charater_type[j];
        }

        var thisline = `<tr class="enemyline" style="border-bottom:2px #f4c43033 solid; display:block;"><td class="enemycell" index="1" width="160px">`;
        thisline += charatype["name"] + `<\/td><td class="enemycell" index="2" width="59px">`;
        thisline += Number(Enemy_in_team[i].number) + `<\/td><td class="enemycell" index="3" width="59px">`;
        thisline += level % 1000 + `<\/td><td class="enemycell" index="4" width="59px">`;
        thisline += bround(enemyattribute(charatype , "maxlife" , level)) + `<\/td><td class="enemycell" index="5" width="59px">`;
        thisline += enemyattribute(charatype , "pow" , level) + `<\/td><td class="enemycell" index="6" width="59px">`;
        thisline += enemyattribute(charatype , "rate" , level) + `<\/td><td class="enemycell" index="7" width="59px">`;
        thisline += enemyattribute(charatype , "hit" , level) + `<\/td><td class="enemycell" index="8" width="59px">`;
        thisline += enemyattribute(charatype , "dodge" , level) + `<\/td><td class="enemycell" index="9" width="59px">`;
        thisline += enemyattribute(charatype , "range" , level) + `<\/td><td class="enemycell" index="10" width="59px">`;
        thisline += enemyattribute(charatype , "speed" , level) + `<\/td><td class="enemycell" index="11" width="59px">`;
        thisline += enemyattribute(charatype , "armor_piercing" , level) + `<\/td><td class="enemycell" index="12" width="59px">`;
        thisline += enemyattribute(charatype , "armor" , level) + `<\/td><td class="enemycell" index="13" width="59px">`;
        thisline += enemyattribute(charatype , "shield" , level) + `<\/td><td class="enemycell" index="14" width="59px">`;
        thisline += enemyattribute(charatype , "def_break" , level) + `<\/td><td class="enemycell" index="15" width="79px">`;
        thisline += enemyattribute(charatype , "def" , level) + `<\/td><td class="enemycell" index="16" width="79px">`;
        thisline += Number(Enemy_in_team[i].def_percent) + `%<\/td><td class="enemycell" index="17" width="80px">`;
        thisline += "(" + Enemy_in_team[i].coordinator_x + "," + Enemy_in_team[i].coordinator_y + `)<\/td><\/tr>`;

        output += thisline;

        dcoordinator(1, "#e91e63", Number(Enemy_in_team[i].coordinator_x), Number(Enemy_in_team[i].coordinator_y));
        dcoordinator(5, "#e91e63", Number(Enemy_in_team[i].coordinator_x), Number(Enemy_in_team[i].coordinator_y), charatype["name"]);
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

function spotTypeDraw(type, xcen, ycen, func){
    var con = $("#exampledrawing")[0].getContext("2d");
    if(func == 1) con = $("#exampledrawing")[0].getContext("2d");
    else if(func == 2) con = $("#downloaddrawing")[0].getContext("2d");
    else con = $("#missiondrawing")[0].getContext("2d");
    con.lineWidth = String(coorchange(3, 20));
    con.lineJoin="round";
    con.strokeStyle = "#111111";
    switch(type){
        /* type 1 指挥部 */
        case 1: {
            con.beginPath();
            con.moveTo(xcen - coorchange(3,  40), ycen + coorchange(3,  50));
            con.lineTo(xcen - coorchange(3,  40), ycen - coorchange(3,  10));
            con.lineTo(xcen - coorchange(3,  50), ycen - coorchange(3,  10));
            con.lineTo(xcen                     , ycen - coorchange(3,  50));
            con.lineTo(xcen + coorchange(3,  50), ycen - coorchange(3,  10));
            con.lineTo(xcen + coorchange(3,  40), ycen - coorchange(3,  10));
            con.lineTo(xcen + coorchange(3,  40), ycen + coorchange(3,  50));
            con.lineTo(xcen - coorchange(3,  40), ycen + coorchange(3,  50));
            con.lineTo(xcen - coorchange(3,  40), ycen - coorchange(3,  10));
            con.moveTo(xcen - coorchange(3,  40), ycen - coorchange(3,  10));
            con.lineTo(xcen + coorchange(3,  40), ycen - coorchange(3,  10));
            con.stroke();
        }break;

        /* type 2 路径点 */
        case 2: {
        }break;

        /* active_cycle 限时机场 */
        case 21: {
            con.beginPath();
            con.moveTo(xcen - coorchange(3,   50), ycen );
            con.lineTo(xcen - coorchange(3,   50), ycen + coorchange(3,   50));
            con.lineTo(xcen + coorchange(3,   50), ycen + coorchange(3,   50));
            con.lineTo(xcen + coorchange(3,   50), ycen );
            con.lineTo(xcen - coorchange(3,   10), ycen );
            con.lineTo(xcen - coorchange(3,   10), ycen + coorchange(3,   50));
            con.moveTo(xcen + coorchange(3,   20), ycen );
            con.lineTo(xcen + coorchange(3,   20), ycen - coorchange(3,   50));
            con.moveTo(xcen - coorchange(3,   10), ycen - coorchange(3,   50));
            con.lineTo(xcen + coorchange(3,   50), ycen - coorchange(3,   50));
            con.moveTo(xcen + coorchange(3, 70.7), ycen - coorchange(3, 70.7));
            con.lineTo(xcen - coorchange(3, 70.7), ycen + coorchange(3, 70.7));
            con.stroke();
        }break;

        /* special_eft 雷达 */
        case 22: {
            con.beginPath();
            con.moveTo(xcen - coorchange(3,  50), ycen - coorchange(3,  50));
            con.lineTo(xcen - coorchange(3,  50), ycen + coorchange(3,  10));
            con.lineTo(xcen + coorchange(3,  50), ycen + coorchange(3,  10));
            con.lineTo(xcen + coorchange(3,  50), ycen - coorchange(3,  50));
            con.lineTo(xcen - coorchange(3,  50), ycen - coorchange(3,  50));
            con.lineTo(xcen - coorchange(3,  50), ycen + coorchange(3,  10));
            con.moveTo(xcen - coorchange(3,  50), ycen - coorchange(3,  20));
            con.lineTo(xcen + coorchange(3,  50), ycen - coorchange(3,  20));
            con.moveTo(xcen - coorchange(3,  20), ycen - coorchange(3,  50));
            con.lineTo(xcen - coorchange(3,  20), ycen + coorchange(3,  10));
            con.moveTo(xcen + coorchange(3,  20), ycen - coorchange(3,  50));
            con.lineTo(xcen + coorchange(3,  20), ycen + coorchange(3,  10));
            con.moveTo(xcen                     , ycen + coorchange(3,  50));
            con.lineTo(xcen                     , ycen + coorchange(3,  10));
            con.stroke();
        }break;

        /* random_get  随机点  */
        case 23: {
            con.beginPath();
            con.arc(xcen, ycen, coorchange(3,  50), Math.PI, 2*Math.PI);
            con.stroke();
            con.beginPath();
            con.moveTo(xcen                     , ycen + coorchange(3,  55));
            con.lineTo(xcen                     , ycen + coorchange(3,  45));
            con.moveTo(xcen                     , ycen + coorchange(3,  40));
            con.lineTo(xcen                     , ycen );
            con.lineTo(xcen + coorchange(3,  50), ycen );
            con.lineTo(xcen                     , ycen );
            con.stroke();
        }break;

        /* type 3 机场 */
        case 3: {
            con.beginPath();
            con.moveTo(xcen - coorchange(3,  50), ycen );
            con.lineTo(xcen - coorchange(3,  50), ycen + coorchange(3,  50));
            con.lineTo(xcen + coorchange(3,  50), ycen + coorchange(3,  50));
            con.lineTo(xcen + coorchange(3,  50), ycen );
            con.lineTo(xcen - coorchange(3,  10), ycen );
            con.lineTo(xcen - coorchange(3,  10), ycen + coorchange(3,  50));
            con.moveTo(xcen + coorchange(3,  20), ycen );
            con.lineTo(xcen + coorchange(3,  20), ycen - coorchange(3,  50));
            con.moveTo(xcen - coorchange(3,  10), ycen - coorchange(3,  50));
            con.lineTo(xcen + coorchange(3,  50), ycen - coorchange(3,  50));
            con.stroke();
        }break;

        /* type 5 补给点 */
        case 5: {
            con.beginPath();
            con.moveTo(xcen - coorchange(3,  50), ycen - coorchange(3,  30));
            con.lineTo(xcen - coorchange(3,  50), ycen + coorchange(3,  30));
            con.lineTo(xcen                     , ycen + coorchange(3,  50));
            con.lineTo(xcen + coorchange(3,  50), ycen + coorchange(3,  30));
            con.lineTo(xcen + coorchange(3,  50), ycen - coorchange(3,  30));
            con.lineTo(xcen                     , ycen - coorchange(3,  50));
            con.lineTo(xcen - coorchange(3,  50), ycen - coorchange(3,  30));
            con.lineTo(xcen - coorchange(3,  50), ycen + coorchange(3,  30));
            con.moveTo(xcen - coorchange(3,  50), ycen - coorchange(3,  30));
            con.lineTo(xcen                     , ycen - coorchange(3,  10));
            con.lineTo(xcen + coorchange(3,  50), ycen - coorchange(3,  30));
            con.moveTo(xcen                     , ycen - coorchange(3,  10));
            con.lineTo(xcen                     , ycen + coorchange(3,  50));
            con.stroke();
        }break;

        /* type 6 集结点 */
        case 6: {
            con.beginPath();
            con.moveTo(xcen - coorchange(3,  50), ycen + coorchange(3,  50));
            con.lineTo(xcen - coorchange(3,  50), ycen - coorchange(3,  50));
            con.lineTo(xcen + coorchange(3,  50), ycen - coorchange(3,  50));
            con.lineTo(xcen + coorchange(3,  50), ycen + coorchange(3,  10));
            con.lineTo(xcen - coorchange(3,  50), ycen + coorchange(3,  10));
            con.stroke();
        }break;

        /* type 7 重装机场 */
        case 7: {
            con.beginPath();
            con.moveTo(xcen - coorchange(3,  50), ycen );
            con.lineTo(xcen - coorchange(3,  50), ycen + coorchange(3,  50));
            con.lineTo(xcen + coorchange(3,  50), ycen + coorchange(3,  50));
            con.lineTo(xcen + coorchange(3,  50), ycen );
            con.lineTo(xcen - coorchange(3,  50), ycen );
            con.lineTo(xcen - coorchange(3,  50), ycen + coorchange(3,  50));
            con.moveTo(xcen + coorchange(3,  20), ycen );
            con.lineTo(xcen + coorchange(3,  20), ycen - coorchange(3,  50));
            con.moveTo(xcen - coorchange(3,  10), ycen - coorchange(3,  50));
            con.lineTo(xcen + coorchange(3,  50), ycen - coorchange(3,  50));
            con.stroke();
        }break;

        default: break;
    }
}

function mapsetcreat(){
    /*下载 sdownload  重置 sredraw  隐藏 smaphide  图例 sexample
    敌人 smapenemy  建筑 smapbuild  类型 smaptype  颜色 smapcolor  标号 smapspotn  逻辑 smapenemyai
    建筑表格 sbuildtable  传送表格 sporttable  点位标记 sspotsign  同组堆叠 senemypile  --*/
    var mapsetoutput = `<div class="mapsetbtncontainer">
      <div class="mapsetbtn" id="sdownload" style="display:inline-block; user-select:none; border:1px #eaeaea solid; padding:5px 10px;"><a style="color:#eaeaea; text-decoration:auto;">${UI_TEXT["function_download_map"]}</a></div>
      <div class="mapsetbtn" id="sredraw" style="display:inline-block; user-select:none; border:1px #eaeaea solid; padding:5px 10px; cursor:pointer;">${UI_TEXT["function_reset_map"]}</div>
      <div class="mapsetbtn" id="smaphide" style="display:inline-block; user-select:none; border:1px #eaeaea solid; padding:5px 10px; cursor:pointer;">${UI_TEXT["function_hide_map"]}</div>
      <div class="mapsetbtn" id="sexample" style="display:inline-block; user-select:none; border:1px #eaeaea solid; padding:5px 10px; cursor:pointer;">${UI_TEXT["function_map_legend"]}</div>
    </div>
    <div class="mapsetbtncontainer">
      <div class="mapsetbtn" id="smapenemy" style="display:inline-block; user-select:none; border:1px #eaeaea solid; padding:5px 10px; background-color:#f4c430; color:black; cursor:pointer;">${UI_TEXT['display_setting_enemies']}</div>
      <div class="mapsetbtn" id="smapbuild" style="display:inline-block; user-select:none; border:1px #eaeaea solid; padding:5px 10px; background-color:#f4c430; color:black; cursor:pointer;">${UI_TEXT['display_setting_buildings']}</div>
      <div class="mapsetbtn" id="smaptype" style="display:inline-block; user-select:none; border:1px #eaeaea solid; padding:5px 10px; background-color:#f4c430; color:black; cursor:pointer;">${UI_TEXT['display_setting_nodetype']}</div>
      <div class="mapsetbtn" id="smapcolor" style="display:inline-block; user-select:none; border:1px #eaeaea solid; padding:5px 10px; background-color:#f4c430; color:black; cursor:pointer;">${UI_TEXT['display_setting_nodecolor']}</div>
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
            var campaignname = $("#campaignselect").find("option:selected").text()
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
                    if(setmessage.sexample == 1) $("#sexample").click();
                }
            } break;
            case "sexample": {
                if(setmessage.sexample == 0) $("#mapexample").slideUp("fast");
                else $("#mapexample").slideDown("fast");
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
        $(".missionline").css("display","block");
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

/*-- 绘制地图的图例 --*/
function examplecreate(){
    var exampleoutput = `<canvas id="exampledrawing" width="1220px" height="120px" style="border:1px #ffffff99 solid;">Your browser does not support the HTML5 canvas tag.</canvas>`;
    $("#mapexample").html(exampleoutput);
    $("#mapexample").css({"display":"none"});
    var con = $("#exampledrawing")[0].getContext("2d");

    con.lineWidth = 4;
    con.strokeStyle = "#111111";
    con.fillStyle = "#03a9f4";
    /*-- 地图图例的路径点 --*/
    con.beginPath();
    con.arc(50, 50, 40, 0, 2*Math.PI);
    con.fill();
    con.stroke();
    con.beginPath();
    con.arc(150, 50, 40, 0, 2*Math.PI);
    con.fill();
    con.stroke();
    con.beginPath();
    con.arc(250, 50, 40, 0, 2*Math.PI);
    con.fill();
    con.stroke();
    con.beginPath();
    con.arc(350, 50, 40, 0, 2*Math.PI);
    con.fill();
    con.stroke();
    con.beginPath();
    con.arc(450, 50, 40, 0, 2*Math.PI);
    con.fill();
    con.stroke();
    con.beginPath();
    con.arc(550, 50, 40, 0, 2*Math.PI);
    con.fill();
    con.stroke();
    con.beginPath();
    con.arc(650, 50, 40, 0, 2*Math.PI);
    con.fill();
    con.stroke();
    con.beginPath();
    con.arc(750, 50, 40, 0, 2*Math.PI);
    con.fill();
    con.stroke();

    /*-- 地图图例的文字 --*/
    con.lineWidth = 4;
    con.strokeStyle = "#eaeaea";
    con.fillStyle = "#eaeaea";
    con.font = `16px bold ${fontList}`;
    con.textAlign="center";

    con.beginPath();
    con.fillText(UI_TEXT["legend_hq"], 50, 110);
    con.stroke();
    con.beginPath();
    con.fillText(UI_TEXT["legend_limited_heli"], 150, 110);
    con.stroke();
    con.beginPath();
    con.fillText(UI_TEXT["legend_radar"], 250, 110);
    con.stroke();
    con.beginPath();
    con.fillText(UI_TEXT["legend_random"], 350, 110);
    con.stroke();
    con.beginPath();
    con.fillText(UI_TEXT["legend_heli"], 450, 110);
    con.stroke();
    con.beginPath();
    con.fillText(UI_TEXT["legend_supply_node"], 550, 110);
    con.stroke();
    con.beginPath();
    con.fillText(UI_TEXT["legend_supply_flag"],  650, 110);
    con.stroke();
    con.beginPath();
    con.fillText(UI_TEXT["legend_heavy_heli"], 750, 110);
    con.stroke();

    /*-- 地图图例的路径点类型 --*/
    var coparasave = coparameter;
    coparameter = 2.5
    spotTypeDraw(1, 50, 50, 1);
    spotTypeDraw(21, 150, 50, 1);
    spotTypeDraw(22, 250, 50, 1);
    spotTypeDraw(23, 350, 50, 1);
    spotTypeDraw(3, 450, 50, 1);
    spotTypeDraw(5, 550, 50, 1);
    spotTypeDraw(6, 650, 50, 1);
    spotTypeDraw(7, 750, 50, 1);
    coparameter = coparasave;

    /*-- 限时机场参数 --*/
    con.lineWidth = "1";
    con.fillStyle = "#111111";
    con.textAlign = "left";
    con.font = `12px bold ${fontList}`;
    con.beginPath();
    con.strokeText("3/1", 150 - 30, 50 - 12);
    con.fillText("3/1", 150 - 30, 50 - 12);
    con.stroke();
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
                <div id="mapexample"></div>
                <div id="missionmap" style="max-width:1220px; overflow-y:scroll; overscroll-behavior-y:contain; border:1px #ffffff99 solid;"></div>
                <div id="spotsign"></div>
                <div id="teleportshow" style="max-width:1222px;"></div>
                <div id="buildingshow" style="max-width:1222px;"></div>
                <div id="missionshow" style="max-width:1222px;"></div>
                <div id="enemychose"></div>
                <div id="enemyshow" style="max-width:1222px;"></div>
                <div id="enemyposition" style="overflow-x:scroll; width:1222px;"></div>
                <div id="otherthing"></div>
                <div id="downloaddraw"></div>`;

    $("#thisdiv").html(output);
}

})();