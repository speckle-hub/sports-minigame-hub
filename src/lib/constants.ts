export interface MatchCallScenario {
  scenario: string
  options: string[]
  correctIndex: number
  explanation: string
}

export const MATCH_CALL_SCENARIOS: MatchCallScenario[] = [
  {
    scenario: "Team A leads 2-0 at halftime with 65% possession. Their striker has had 4 shots, all on target. The opponent hasn't registered a single shot.",
    options: [
      "Team A wins 3-0 or more",
      "Team A wins 2-1",
      "Opponent mounts a comeback and draws",
      "Team A wins 2-0",
    ],
    correctIndex: 0,
    explanation:
      "With complete dominance and clinical finishing, Team A extends the lead. Zero opposition shots suggests no threat of a comeback.",
  },
  {
    scenario: "A striker has taken 6 shots, only 1 on target. It's the 70th minute, his team trails 1-0. He's had three big chances saved.",
    options: [
      "He's subbed off without scoring",
      "He scores an equalizer before full time",
      "He gets a hat-trick",
      "He assists a teammate for the equalizer",
    ],
    correctIndex: 0,
    explanation:
      "Poor conversion rate (1/6 on target) and three saves against him suggest an off day. Most managers would hook him for a fresh option.",
  },
  {
    scenario: "Midfielder has completed 112/118 passes (95%), 4 key passes, 2 chances created. His team is drawing 1-1 away from home. 75th minute.",
    options: [
      "He provides the winning assist",
      "He gets substituted to shore up defense",
      "He scores a long-range winner",
      "The match ends 1-1",
    ],
    correctIndex: 3,
    explanation:
      "Dominant midfield performance but drawing away from home in the 75th — away draws are respected results. The data suggests control, not a late winner.",
  },
  {
    scenario: "Defender has made 12 clearances, 5 blocks, 3 interceptions. His team has faced 18 shots. They lead 1-0. 80th minute.",
    options: [
      "The opponent equalizes from a set piece",
      "His team holds on for a clean sheet",
      "He scores an own goal",
      "His team concedes twice and loses",
    ],
    correctIndex: 1,
    explanation:
      "A towering defensive performance under relentless pressure. When a defender hits those numbers and the team still leads late, they usually see it out.",
  },
  {
    scenario: "Goalkeeper has made 7 saves, 3 from inside the box. Expected Goals (xG) against is 2.8, but he's only conceded 1. 85th minute, team leads 1-0.",
    options: [
      "He keeps a clean sheet and wins MOTM",
      "He concedes a late equalizer",
      "He's sent off for a handball outside the box",
      "The opponent scores twice in injury time",
    ],
    correctIndex: 0,
    explanation:
      "A goalkeeper outperforming xG by 1.8 goals while his team leads late is having a world-class day. He sees it through.",
  },
  {
    scenario: "Team has 28% possession, 2 shots (0 on target), but leads 1-0 at half time via an own goal. They're away to the league leaders.",
    options: [
      "They lose 3-1",
      "They win 1-0",
      "They draw 1-1",
      "They lose 2-0",
    ],
    correctIndex: 1,
    explanation:
      "Some games are written in the stars. A smash-and-grab away performance with a lucky lead and no attacking threat — the classic 1-0 snatch-and-grab holds.",
  },
  {
    scenario: "Winger has completed 2/8 dribbles, lost possession 14 times, but has 2 assists from set pieces. His team trails 2-0. 60th minute.",
    options: [
      "He's substituted before the 70th minute",
      "He creates another assist for a comeback",
      "He scores a solo goal",
      "He completes 5 more dribbles",
    ],
    correctIndex: 0,
    explanation:
      "Losing the ball 14 times with only 25% dribble success is a liability. Set piece delivery isn't enough to keep him on when chasing the game.",
  },
  {
    scenario: "Team has had 3 penalties this season, scored all 3. They win a 4th penalty in the 89th minute, trailing 1-0. The regular taker is still on the pitch.",
    options: [
      "The regular taker scores the equalizer",
      "The taker misses under pressure",
      "A different player steps up and scores",
      "The goalkeeper saves it",
    ],
    correctIndex: 0,
    explanation:
      "100% record from the spot this season and the regular taker is on the pitch. Pressure is high but history favors the specialist.",
  },
  {
    scenario: "Center-back pairing has kept 3 clean sheets in their last 4 starts together. Today they're facing the league's top scorer. 0-0 at half time.",
    options: [
      "The center-backs keep another clean sheet",
      "The top scorer breaks the deadlock",
      "The match ends 0-0",
      "One center-back gets sent off",
    ],
    correctIndex: 2,
    explanation:
      "A solid partnership against the league's best — at half time it's a stalemate. Both sides cancel each other out. 0-0 is the most likely outcome given the defensive track record.",
  },
  {
    scenario: "Substitute striker comes on in the 65th minute. He's scored 4 goals in his last 6 substitute appearances. His team trails 1-0.",
    options: [
      "He scores an equalizer",
      "He makes no impact and the team loses",
      "He scores a brace and wins the game",
      "He gets injured within 10 minutes",
    ],
    correctIndex: 0,
    explanation:
      "A proven impact sub with strong form off the bench. He's likely to get one, but a brace is too optimistic for a 25-minute cameo.",
  },
  {
    scenario: "Captain is playing his 300th game for the club. His team is 3-0 up. He's already scored once. 75th minute.",
    options: [
      "He completes the full match and gets a standing ovation",
      "He's subbed off to a guard of honor",
      "He scores a second",
      "He gets a red card for a reckless challenge",
    ],
    correctIndex: 1,
    explanation:
      "300th appearance, 3-0 up, already scored — the manager will sub him off around the 80th minute for a solo ovation. Classic milestone management.",
  },
  {
    scenario: "Rain is pouring, pitch is heavy. It's the 80th minute, 0-0. Both teams look tired. Only 2 shots on target combined all match.",
    options: [
      "The match ends 0-0",
      "A defensive error decides it 1-0",
      "Both teams score in the final 10 minutes",
      "A long-range stunner wins it",
    ],
    correctIndex: 0,
    explanation:
      "Terrible conditions, tired legs, and zero attacking quality all game. A 0-0 grind is the most probable finish in these conditions.",
  },
  {
    scenario: "Star midfielder is on a yellow card. He's made 5 tactical fouls already without being caught. His team leads 2-1. 75th minute.",
    options: [
      "He gets a second yellow and is sent off",
      "He's substituted immediately to protect the lead",
      "He scores to make it 3-1",
      "He survives without another booking",
    ],
    correctIndex: 1,
    explanation:
      "Five tactical fouls already and on a yellow is begging for a red. Any sensible manager subs him off immediately to protect the 2-1 lead.",
  },
  {
    scenario: "Team is 3-0 down on aggregate in a cup semifinal (first leg). It's the 50th minute of the second leg and they lead 1-0 on the night. They need 3 more goals.",
    options: [
      "They push forward and concede again",
      "They score 3 and force extra time",
      "They score 2 but go out 4-3 on aggregate",
      "They win 2-0 but go out 3-2 on aggregate",
    ],
    correctIndex: 0,
    explanation:
      "Needing three goals means pushing numbers forward, which leaves gaps. Against a team protecting a 3-goal lead, the counter-attack goal is the likeliest next event.",
  },
  {
    scenario: "Young winger is making his full debut. He's beaten his full-back 4 times in the first 30 minutes. The full-back is on a yellow card.",
    options: [
      "The full-back gets sent off for a second yellow on the winger",
      "The winger scores his first senior goal",
      "The full-back is subbed off at half time",
      "The winger fades as the game goes on",
    ],
    correctIndex: 2,
    explanation:
      "Getting destroyed 4 times in 30 minutes while on a yellow — the full-back is a defensive liability. The manager will hook him at half time to stop the bleeding.",
  },
  {
    scenario: "Derby match. Rivalry game. 0-0 at half time. Total cards so far: 5 yellow, 0 red. 27 fouls committed. Temperature is boiling over.",
    options: [
      "A player gets sent off in the second half",
      "The second half is calmer than the first",
      "A fight breaks out between both benches",
      "The referee loses control and abandons the match",
    ],
    correctIndex: 0,
    explanation:
      "27 fouls and 5 yellows in a half. The second half always boils over further in heated derbies. A red card is almost inevitable.",
  },
  {
    scenario: "Team A has a corner. They've scored from 3 of their last 12 corners (25%). Their giant center-back is the target. 88th minute, 0-0.",
    options: [
      "The center-back heads it wide",
      "The goalkeeper claims the cross comfortably",
      "The center-back scores the late winner",
      "Team A concedes on the counter from the corner",
    ],
    correctIndex: 0,
    explanation:
      "25% conversion from corners is solid but far from guaranteed. A headed effort on target is likely, but scoring a 88th-minute winner from a corner is unlikely.",
  },
  {
    scenario: "It's a cup final. Both teams have had 10 shots each. Expected goals: Team A 1.2, Team B 1.1. Extra time is 10 minutes away. Score is 1-1.",
    options: [
      "The match goes to extra time and penalties",
      "Team A scores a 90th-minute winner",
      "Team B scores a 90th-minute winner",
      "The match ends 1-1 and goes straight to penalties",
    ],
    correctIndex: 0,
    explanation:
      "Perfectly matched final. Equal shots, near-identical xG. Extra time is the likeliest outcome — both teams cancel each other out over 90 minutes.",
  },
  {
    scenario: "Promotion decider. Team A needs a win to go up automatically. They're at home. 85th minute, still 0-0. The crowd is anxious. Long ball launched into the box.",
    options: [
      "The ball is cleared and the match ends 0-0",
      "A scramble and a tap-in wins it for Team A",
      "Team B breaks away and scores the winner",
      "A penalty is awarded to Team A",
    ],
    correctIndex: 0,
    explanation:
      "Panic long balls with an anxious crowd rarely produce clean chances. A scramble might happen, but most panic launches end in a routine clearance.",
  },
  {
    scenario: "Top scorer has gone 4 games without a goal (longest drought of his career). His xG over those 4 games is 3.4. He's had 16 shots. Today he's playing the bottom team.",
    options: [
      "He scores a brace and ends the drought",
      "He scores once in a comfortable win",
      "He misses guilt-edge chances and stays scoreless",
      "He provides 2 assists but doesn't score",
    ],
    correctIndex: 1,
    explanation:
      "3.4 xG over 4 games means he's getting chances, just unlucky. Against the bottom team, the dam breaks — he scores, but a brace is optimistic for someone in poor form.",
  },
  {
    scenario: "A winger has completed 8/12 dribbles and created 4 chances. His cross success rate is 40%. His team trails 1-0. 65th minute.",
    options: [
      "He provides an assist off a dribble and cross",
      "He's substituted for a defensive option",
      "He scores a solo goal cutting inside",
      "He switches flanks to find space",
    ],
    correctIndex: 0,
    explanation: "Strong dribbling and chance creation suggest he's the most likely source of an equalizer. His crossing is decent enough to produce an assist.",
  },
  {
    scenario: "Two teams are level on points with 5 games remaining. Team A has a +12 goal difference, Team B has +6. Team A faces three top-half teams, Team B faces four relegation candidates.",
    options: [
      "Team A wins the title comfortably",
      "Team B edges it on the final day",
      "Both teams drop points and a third team wins",
      "Team A crumbles under pressure",
    ],
    correctIndex: 1,
    explanation: "Team B's easier run-in gives them the edge. Facing relegation candidates is still easier than top-half opposition over 5 games.",
  },
  {
    scenario: "A striker has scored in 4 consecutive matches. He's averaging 3.5 shots per game with 60% on target. He's playing against a team that hasn't kept a clean sheet in 6 games.",
    options: [
      "He extends his scoring streak to 5 games",
      "He's kept quiet by a tactical double-team",
      "He gets an assist but no goal",
      "He misses a penalty",
    ],
    correctIndex: 0,
    explanation: "Four-game streak with high shot volume against a leaky defense strongly suggests he scores again. Form and fixture align.",
  },
  {
    scenario: "A substitute is brought on in the 70th minute with his team down 1-0. He's scored 3 goals this season, all as a sub. He's known for late runs into the box.",
    options: [
      "He scores a late equalizer",
      "He picks up a yellow card for a tactical foul",
      "He fails to make an impact",
      "He provides the winning assist",
    ],
    correctIndex: 0,
    explanation: "A proven impact sub with a history of scoring late against tired legs — the data strongly favors an equalizer.",
  },
  {
    scenario: "A central defender has won 90% of aerial duels this season. The opposition's main tactic is long balls and crosses. The match is 0-0 at halftime.",
    options: [
      "The defender dominates and keeps a clean sheet",
      "The opposition scores from a set piece",
      "The defender gets beaten for pace on the counter",
      "The match ends 0-0",
    ],
    correctIndex: 3,
    explanation: "The defender's aerial dominance neutralizes the opponent's main threat. 0-0 at half suggests a stalemate that's likely to continue.",
  },
  {
    scenario: "A playmaker has completed 90% of passes, 5 key passes, and 2 big chances created. But his team trails 2-0. The manager makes a double substitution in the 60th minute.",
    options: [
      "The playmaker orchestrates a comeback",
      "The team loses 2-0 despite the changes",
      "The playmaker is substituted off",
      "The score becomes 2-1 but no equalizer",
    ],
    correctIndex: 1,
    explanation: "Despite individual brilliance, a 2-0 deficit is steep. The playmaker is doing everything right but the team collectively isn't performing.",
  },
  {
    scenario: "A young full-back has made 3 tackles, 2 interceptions, and completed 88% of passes. He's up against a speedy winger who has beaten him twice already. 55th minute.",
    options: [
      "He adapts and neutralizes the winger in the second half",
      "He gets sent off for a second yellow",
      "The winger scores after beating him again",
      "He's substituted at halftime",
    ],
    correctIndex: 3,
    explanation: "Two beatings in 55 minutes suggests the full-back is struggling. A good manager recognizes this and makes an early change.",
  },
  {
    scenario: "A defensive midfielder has covered 11km already, made 8 recoveries, and won 5/6 tackles. His passing accuracy dropped to 72% in the last 15 minutes. 75th minute.",
    options: [
      "He's substituted due to fatigue",
      "He scores a rare goal from outside the box",
      "He receives a yellow card for a late tackle",
      "He finishes the match strongly",
    ],
    correctIndex: 0,
    explanation: "11km covered with declining passing accuracy signals fatigue. A manager protects their lead by bringing on fresh legs.",
  },
  {
    scenario: "A team has scored 8 goals from set pieces this season (most in the league). They're awarded a corner in the 85th minute, trailing 1-0.",
    options: [
      "They score from the corner",
      "They concede on the counter from the corner",
      "The corner comes to nothing",
      "A defender is sent off during the corner",
    ],
    correctIndex: 0,
    explanation: "The league's best set-piece team with a corner in a high-pressure moment — the numbers heavily favor a goal.",
  },
]

export const TACTICS_DAILY_PUZZLES: Array<{
  answer: string
  clues: string[]
  hint: string
  explanation: string
}> = [
  {
    answer: "4-3-3",
    clues: [
      "This formation uses a single pivot in midfield",
      "Wingers are the primary attacking threat",
      "The full-backs provide width in attack",
      "Three forwards lead the line",
      "A classic Johan Cruyff favorite",
      "Often described as fluid and attacking",
    ],
    hint: "Think total football",
    explanation:
      "The 4-3-3 formation, popularized by Ajax and Barcelona, uses four defenders, three midfielders (typically one defensive pivot), and three forwards. It offers width through wingers and allows fluid attacking movements.",
  },
  {
    answer: "Gegenpress",
    clues: [
      "This tactic activates immediately after losing possession",
      "It requires exceptional fitness levels",
      "Jürgen Klopp made it famous in the modern era",
      "The team presses in coordinated waves",
      "Players hunt in packs of 2-3",
      "Red Bull clubs are known for this style",
    ],
    hint: "Heavy metal football",
    explanation:
      "Gegenpressing (counter-pressing) is a tactic where teams press intensely immediately after losing the ball, aiming to win it back within seconds. It requires incredible fitness, coordination, and tactical discipline.",
  },
  {
    answer: "Tiki-Taka",
    clues: [
      "Short passing is the foundation of this style",
      "Positional play creates passing triangles everywhere",
      "Pep Guardiola perfected this approach",
      "Possession is used as both defense and attack",
      "The goalkeeper is often the first attacker",
      "Iniesta and Xavi were its greatest exponents",
    ],
    hint: "Passing carousel",
    explanation:
      "Tiki-Taka is characterized by short, quick passes and constant movement to maintain possession. It relies on creating passing triangles all over the pitch, with players comfortable in tight spaces.",
  },
  {
    answer: "Catenaccio",
    clues: [
      "This system originated in Italy",
      "A sweeper sits behind the defensive line",
      "It prioritizes defensive solidity above all",
      "Counter-attacks are quick and direct",
      "Helenio Herrera made it legendary",
      "The libero role is key to this setup",
    ],
    hint: "Door bolt",
    explanation:
      "Catenaccio (Italian for 'door bolt') is a defensive system that uses a sweeper (libero) behind a man-marking defensive line. It focuses on denying space and hitting opponents on the counter.",
  },
  {
    answer: "False 9",
    clues: [
      "The striker drops deep into midfield",
      "This confuses traditional center-backs",
      "Lionel Messi redefined this role",
      "Creates numerical overload in midfield",
      "Wingers make runs into the vacated space",
      "Requires exceptional close control and vision",
    ],
    hint: "The phantom striker",
    explanation:
      "The False 9 is a striker who drops deep into midfield rather than staying high. This pulls center-backs out of position, creating space for wingers to attack. Messi's role under Guardiola is the definitive example.",
  },
  {
    answer: "3-5-2",
    clues: [
      "Wing-backs are the key providers of width",
      "Three center-backs offer defensive stability",
      "Antonio Conte revitalized this formation",
      "Two strikers partner up front",
      "The midfield trio controls the center",
      "It can shift to a 5-3-2 when defending",
    ],
    hint: "Modern classic",
    explanation:
      "The 3-5-2 uses three center-backs, two wing-backs, a three-man midfield, and two strikers. It provides defensive solidity while allowing wing-backs to dominate the flanks offensively.",
  },
  {
    answer: "Route One",
    clues: [
      "Direct play is the defining characteristic",
      "Long balls target a target man up front",
      "Second balls are crucial to this style",
      "Often uses a big physical striker",
      "Commonly associated with lower leagues",
      "Minimal build-up play in midfield",
    ],
    hint: "Straight to the point",
    explanation:
      "Route One football bypasses midfield with long balls aimed at a target man. The emphasis is on winning second balls and playing in the opponent's half. It's direct, physical, and effective.",
  },
  {
    answer: "Total Football",
    clues: [
      "Every outfield player can play any position",
      "Rinus Michels and Ajax invented this",
      "The Netherlands 1974 team defined it",
      "Players constantly interchange positions",
      "Johan Cruyff was its brightest star",
      "It requires universal technical ability",
    ],
    hint: "Dutch masterclass",
    explanation:
      "Total Football (Totaalvoetbal) is a system where players are comfortable in multiple positions and constantly interchange. This fluidity makes it impossible for opponents to track runs and maintain defensive shape.",
  },
  {
    answer: "Park the Bus",
    clues: [
      "An ultra-defensive approach",
      "All 11 players defend deep",
      "Jose Mourinho is famous for this",
      "Leaves almost no space behind the ball",
      "Often used to protect a narrow lead",
      "Critics call it anti-football",
    ],
    hint: "The ultimate low block",
    explanation:
      "'Parking the bus' refers to a team defending with all players behind the ball, creating a crowded defensive block. It's designed to frustrate opponents and protect a result, often against stronger teams.",
  },
  {
    answer: "High Line",
    clues: [
      "The defensive line pushes high up the pitch",
      "Offside traps are a key weapon",
      "Requires fast center-backs",
      "Compresses space between the lines",
      "Risk-reward: dangerous but controlling",
      "Pep Guardiola's teams use this aggressively",
    ],
    hint: "Defending on the front foot",
    explanation:
      "A high defensive line pushes defenders close to midfield, compressing space and catching attackers offside. It requires exceptional coordination, pace, and bravery from the back line.",
  },
]

export const REFLEX_RUSH_ROUNDS = 5
export const MATCH_CALL_ROUNDS = 5
export const MATCH_CALL_TIMER_MS = 10000
export const TACTICS_MAX_GUESSES = 6
export const TRUE_FALSE_ROUNDS = 5
export const TRUE_FALSE_TIMER_MS = 6000

export interface TrueFalseQuestion {
  statement: string
  answer: boolean
  explanation: string
}

export const TRUE_FALSE_QUESTIONS: TrueFalseQuestion[] = [
  {
    statement: "Cristiano Ronaldo has scored more international goals than any player in history.",
    answer: true,
    explanation: "Ronaldo holds the record for most international goals with over 130 goals for Portugal.",
  },
  {
    statement: "The World Cup has been held every 4 years since its inception in 1930.",
    answer: true,
    explanation: "The World Cup has been held every 4 years since 1930, except for 1942 and 1946 due to World War II.",
  },
  {
    statement: "Lionel Messi has won more Ballon d'Or awards than Cristiano Ronaldo.",
    answer: true,
    explanation: "Messi has won the Ballon d'Or 8 times, while Ronaldo has won it 5 times.",
  },
  {
    statement: "Brazil has won the World Cup more times than any other nation.",
    answer: true,
    explanation: "Brazil has won the World Cup 5 times (1958, 1962, 1970, 1994, 2002), more than any other country.",
  },
  {
    statement: "The Premier League was founded in 1992.",
    answer: true,
    explanation: "The Premier League replaced the Football League First Division in 1992.",
  },
  {
    statement: "Pele never played football in Europe.",
    answer: false,
    explanation: "Pele played his entire club career for Santos FC in Brazil and briefly for New York Cosmos, but never played professionally in Europe.",
  },
  {
    statement: "England won the World Cup in 1966.",
    answer: true,
    explanation: "England hosted and won the 1966 World Cup, defeating West Germany 4-2 in the final at Wembley.",
  },
  {
    statement: "AC Milan has won more Champions League titles than any other club.",
    answer: false,
    explanation: "Real Madrid holds the record with 15 Champions League titles. AC Milan has 7.",
  },
  {
    statement: "Zlatan Ibrahimovic has played for Manchester United.",
    answer: true,
    explanation: "Zlatan played for Manchester United from 2016 to 2017, scoring 28 goals in 46 appearances.",
  },
  {
    statement: "The offside rule was introduced in 1883.",
    answer: true,
    explanation: "The offside rule was first introduced by the Football Association in 1883.",
  },
  {
    statement: "Mohamed Salah has won the African Player of the Year award more than once.",
    answer: true,
    explanation: "Salah has won the African Player of the Year award twice (2017, 2018).",
  },
  {
    statement: "The Champions League was previously called the European Cup.",
    answer: true,
    explanation: "The competition was renamed from the European Cup to the UEFA Champions League in 1992.",
  },
  {
    statement: "Germany has never hosted a World Cup.",
    answer: false,
    explanation: "Germany hosted the World Cup in 1974 (as West Germany) and 2006.",
  },
  {
    statement: "A red card in football means a player is suspended for at least one match.",
    answer: true,
    explanation: "A red card results in automatic suspension, typically for at least one match depending on the offense.",
  },
  {
    statement: "Manchester City has never won the Champions League.",
    answer: false,
    explanation: "Manchester City won their first Champions League title in 2023, defeating Inter Milan.",
  },
  {
    statement: "The FIFA World Cup trophy is made entirely of gold.",
    answer: false,
    explanation: "The trophy is made of 18-carat gold but is hollow, not solid gold. It weighs about 6 kg.",
  },
  {
    statement: "Women's football was banned by the FA in 1921.",
    answer: true,
    explanation: "The FA banned women's matches from club grounds in 1921, a ban that lasted until 1971.",
  },
  {
    statement: "Harry Kane is Tottenham Hotspur's all-time leading goalscorer.",
    answer: true,
    explanation: "Kane surpassed Jimmy Greaves' record to become Tottenham's all-time leading scorer with 280 goals.",
  },
  {
    statement: "The Golden Boot is awarded to the top scorer of a tournament.",
    answer: true,
    explanation: "The Golden Boot is awarded to the highest goalscorer in competitions like the World Cup and European leagues.",
  },
  {
    statement: "Barcelona's Camp Nou is the largest stadium in Europe.",
    answer: true,
    explanation: "Camp Nou has a capacity of over 99,000, making it the largest stadium in Europe.",
  },
  {
    statement: "VAR was introduced in the Premier League in 2018.",
    answer: false,
    explanation: "VAR was introduced in the Premier League in the 2019/20 season, not 2018.",
  },
  {
    statement: "Diego Maradona scored the 'Hand of God' goal in a World Cup semi-final.",
    answer: false,
    explanation: "The 'Hand of God' goal was scored in the 1986 World Cup quarter-final against England, not the semi-final.",
  },
  {
    statement: "Arsene Wenger managed Arsenal for 22 years.",
    answer: true,
    explanation: "Wenger managed Arsenal from 1996 to 2018, a tenure of exactly 22 years.",
  },
  {
    statement: "A goal can be scored directly from a throw-in.",
    answer: false,
    explanation: "A goal cannot be scored directly from a throw-in. If the ball enters the goal from a throw-in, a goal kick is awarded.",
  },
  {
    statement: "The Asian Cup has been won by Japan more times than any other nation.",
    answer: false,
    explanation: "Japan has won the Asian Cup 4 times, but Saudi Arabia and Iran also have 4 titles each.",
  },
  {
    statement: "Kylian Mbappe scored a hat-trick in a World Cup final.",
    answer: true,
    explanation: "Mbappe scored a hat-trick for France in the 2022 World Cup final against Argentina, becoming only the second player to do so.",
  },
  {
    statement: "The penalty shootout was introduced in 1970.",
    answer: true,
    explanation: "Penalty shootouts were introduced by FIFA in 1970 and first used in the 1978 World Cup.",
  },
  {
    statement: "Leicester City won the Premier League in 2015/16.",
    answer: true,
    explanation: "Leicester City won the Premier League in the 2015/16 season at odds of 5000/1.",
  },
  {
    statement: "The original World Cup trophy was named the Jules Rimet Trophy.",
    answer: true,
    explanation: "The original trophy was named after FIFA president Jules Rimet and was awarded from 1930 to 1970.",
  },
  {
    statement: "Liverpool has won more European Cups than any other English club.",
    answer: true,
    explanation: "Liverpool has won the European Cup/Champions League 6 times, more than any other English club.",
  },
  {
    statement: "Yaya Touré won the African Player of the Year award four times in a row.",
    answer: true,
    explanation: "Yaya Touré won the award in 2011, 2012, 2013, and 2014 — four consecutive years.",
  },
  {
    statement: "A penalty shootout consists of 10 penalties per team.",
    answer: false,
    explanation: "Each team takes 5 penalties initially. If still tied, sudden death follows.",
  },
  {
    statement: "Chelsea won the UEFA Champions League in 2021.",
    answer: true,
    explanation: "Chelsea defeated Manchester City 1-0 in the 2021 final in Porto.",
  },
  {
    statement: "The 'Busby Babes' refers to the Manchester United youth team of the 1950s.",
    answer: true,
    explanation: "The Busby Babes were the young Manchester United team managed by Matt Busby in the 1950s.",
  },
  {
    statement: "Zinedine Zidane was sent off in the 2006 World Cup final.",
    answer: true,
    explanation: "Zidane was sent off for headbutting Marco Materazzi in extra time of the 2006 final.",
  },
  {
    statement: "Barcelona's Camp Nou has a capacity of over 100,000 spectators.",
    answer: false,
    explanation: "Camp Nou's official capacity is 99,354. It's the largest stadium in Europe but under 100,000.",
  },
  {
    statement: "The first Premier League season was 1992/93.",
    answer: true,
    explanation: "The Premier League launched in 1992, replacing the Football League First Division.",
  },
  {
    statement: "Ryan Giggs won 13 Premier League titles with Manchester United.",
    answer: true,
    explanation: "Giggs holds the record for most Premier League titles with 13, all with Manchester United.",
  },
  {
    statement: "Bayern Munich has won the treble (league, cup, and Champions League) more than once.",
    answer: true,
    explanation: "Bayern won the treble in 2013 and again in 2020.",
  },
  {
    statement: "A referee can change a decision after play has restarted.",
    answer: false,
    explanation: "Once play has restarted, the referee cannot change a decision.",
  },
]

export interface CareerPathPlayer {
  name: string
  clubs: string[]
}

export const CAREER_PATH_PLAYERS: CareerPathPlayer[] = [
  {
    name: "Cristiano Ronaldo",
    clubs: ["Sporting CP", "Manchester United", "Real Madrid", "Juventus", "Manchester United", "Al-Nassr"],
  },
  {
    name: "Lionel Messi",
    clubs: ["Barcelona", "Paris Saint-Germain", "Inter Miami"],
  },
  {
    name: "Zlatan Ibrahimovic",
    clubs: ["Malmo", "Ajax", "Juventus", "Inter Milan", "Barcelona", "AC Milan", "Paris Saint-Germain", "Manchester United", "LA Galaxy", "AC Milan"],
  },
  {
    name: "David Beckham",
    clubs: ["Manchester United", "Real Madrid", "LA Galaxy", "AC Milan", "Paris Saint-Germain"],
  },
  {
    name: "Neymar Jr",
    clubs: ["Santos", "Barcelona", "Paris Saint-Germain", "Al-Hilal"],
  },
  {
    name: "Kylian Mbappe",
    clubs: ["Monaco", "Paris Saint-Germain", "Real Madrid"],
  },
  {
    name: "Luis Suarez",
    clubs: ["Ajax", "Liverpool", "Barcelona", "Atletico Madrid", "Gremio", "Inter Miami"],
  },
  {
    name: "Robert Lewandowski",
    clubs: ["Borussia Dortmund", "Bayern Munich", "Barcelona"],
  },
  {
    name: "Kevin De Bruyne",
    clubs: ["Chelsea", "Werder Bremen", "Wolfsburg", "Manchester City"],
  },
  {
    name: "Karim Benzema",
    clubs: ["Lyon", "Real Madrid", "Al-Ittihad"],
  },
  {
    name: "Sergio Aguero",
    clubs: ["Atletico Madrid", "Manchester City", "Barcelona"],
  },
  {
    name: "Wayne Rooney",
    clubs: ["Everton", "Manchester United", "DC United", "Everton", "Derby County"],
  },
  {
    name: "Gareth Bale",
    clubs: ["Tottenham Hotspur", "Real Madrid", "LAFC"],
  },
  {
    name: "Ronaldinho",
    clubs: ["Gremio", "Paris Saint-Germain", "Barcelona", "AC Milan", "Fluminense"],
  },
  {
    name: "Thierry Henry",
    clubs: ["Monaco", "Juventus", "Arsenal", "Barcelona", "New York Red Bulls"],
  },
  {
    name: "Andriy Shevchenko",
    clubs: ["Dynamo Kyiv", "AC Milan", "Chelsea", "Dynamo Kyiv"],
  },
  {
    name: "Steven Gerrard",
    clubs: ["Liverpool", "LA Galaxy"],
  },
  {
    name: "Frank Lampard",
    clubs: ["West Ham United", "Chelsea", "Manchester City", "New York City FC"],
  },
  {
    name: "Andrea Pirlo",
    clubs: ["Brescia", "Inter Milan", "AC Milan", "Juventus", "New York City FC"],
  },
  {
    name: "Paul Pogba",
    clubs: ["Manchester United", "Juventus", "Manchester United", "Juventus"],
  },
  {
    name: "Luka Modric",
    clubs: ["Dinamo Zagreb", "Tottenham Hotspur", "Real Madrid"],
  },
  {
    name: "Virgil van Dijk",
    clubs: ["Groningen", "Celtic", "Southampton", "Liverpool"],
  },
  {
    name: "Erling Haaland",
    clubs: ["Bryne", "Molde", "Red Bull Salzburg", "Borussia Dortmund", "Manchester City"],
  },
  {
    name: "Jude Bellingham",
    clubs: ["Birmingham City", "Borussia Dortmund", "Real Madrid"],
  },
  {
    name: "Mohamed Salah",
    clubs: ["Basel", "Chelsea", "Fiorentina", "Roma", "Liverpool"],
  },
  {
    name: "Sadio Mane",
    clubs: ["Metz", "Red Bull Salzburg", "Southampton", "Liverpool", "Bayern Munich", "Al-Nassr"],
  },
  {
    name: "Eden Hazard",
    clubs: ["Lille", "Chelsea", "Real Madrid"],
  },
  {
    name: "Sergio Busquets",
    clubs: ["Barcelona", "Inter Miami"],
  },
  {
    name: "Xavi Hernandez",
    clubs: ["Barcelona", "Al-Sadd"],
  },
  {
    name: "Andres Iniesta",
    clubs: ["Barcelona", "Vissel Kobe"],
  },
  {
    name: "Claudio Pizarro",
    clubs: ["Werder Bremen", "Bayern Munich", "Chelsea", "Werder Bremen", "Bayern Munich", "Werder Bremen", "Cologne"],
  },
]

export const CAREER_PATH_ROUNDS = 5
export const CAREER_PATH_MAX_CLUBS = 6

export const FOOTBALL_AZ_LETTERS: Record<string, string[]> = {
  A: ["adriano", "aguero", "akinfeev", "alaba", "aldair", "alexis sanchez", "alisson", "alonso", "alter", "alves", "ancelotti", "anelka", "arnold", "arteta", "asensio", "ashley cole", "aspas", "aubameyang", "azpilicueta"],
  B: ["baggio", "ballack", "bale", "balotelli", "baresi", "barnes", "barry", "barthez", "batistuta", "beckham", "bellingham", "berbatov", "bergkamp", "benzema", "bobby moore", "bonucci", "bruce", "buffon", "busquets"],
  C: ["cafu", "cambiasso", "cannavaro", "cantona", "carragher", "carvalho", "casemiro", "casillas", "cavani", "ceballos", "cech", "charles", "charlton", "chicharito", "chiellini", "clyne", "cole", "coman", "costa", "courtois", "crespo", "crouch", "cruyff", "coutinho"],
  D: ["dalglish", "davids", "de bruyne", "de gea", "de ligt", "de rossi", "del piero", "desailly", "deschamps", "di maria", "di stefano", "dida", "dier", "dixie dean", "donnarumma", "drogba", "duncan edwards", "dzeko"],
  E: ["eden hazard", "eto'o", "essien", "eusebio", "evra", "el shaarawy", "emerson", "emery", "emre can", "emre mor", "eriksen", "ernie", "esposito"],
  F: ["fabinho", "fabregas", "fàbregas", "falcao", "ferdinand", "fernandes", "ferran torres", "figo", "firmino", "foden", "forlan", "forster", "fowler", "frimpong", "fuchs"],
  G: ["garrincha", "gattuso", "george best", "george weah", "gerrard", "giggs", "ginola", "godin", "gomes", "goretzka", "gotze", "griezmann", "guardiola", "gullit", "gundogan"],
  H: ["haaland", "hagi", "haller", "hamstring", "hansen", "havertz", "henderson", "henry", "heskey", "higuain", "hoddle", "howard", "hummels", "hunt", "hwang"],
  I: ["ibrahimovic", "icardi", "igi", "imobile", "iniesta", "inzaghi", "isco", "isak", "ivan", "ivanovic", "ivey"],
  J: ["jairzinho", "james", "james milner", "jay jay okocha", "jesus", "jimmy greaves", "joao felix", "johan cruyff", "john barnes", "john terry", "jordi alba", "jorginho", "jose mourinho", "juan mata", "juan roman riquelme", "juanfran", "jude bellingham", "julian alvarez", "julio cesar", "junior"],
  K: ["kaka", "kane", "kante", "kasper schmeichel", "keane", "keegan", "kehrer", "keita", "kewell", "ki", "kiernan", "kimmich", "klinsmann", "klose", "koeman", "kompany", "konate", "kovacic", "kroos", "kvaratskhelia", "kyle walker", "kylian mbappe"],
  L: ["lahm", "lampard", "larsson", "laudrup", "le tissier", "leboeuf", "leao", "leno", "leonardo", "leroy sane", "lewandowski", "lineker", "litmanen", "lloris", "lukaku", "luis enrique", "luis figo", "luis suarez", "lukaku"],
  M: ["maicon", "makelele", "maldini", "mane", "manuel neuer", "maradona", "marchisio", "martinez", "matthaus", "mbappe", "mendieta", "messi", "michael owen", "milito", "milner", "modric", "mohamed salah", "muller", "musiala"],
  N: ["nani", "nedved", "neuer", "neville", "neymar", "nicolas anelka", "nistelrooy", "nkunku", "nuno mendes", "nunez", "nuno gomes", "nesta"],
  O: ["oblak", "ochoa", "odegaard", "okocha", "oliseh", "onana", "origi", "osimhen", "osmend", "overmars", "owen", "ozil"],
  P: ["payet", "pele", "perisic", "peter schmeichel", "petit", "petric", "pirlo", "pires", "pique", "pippo inzaghi", "platini", "pogba", "poulsen", "puyol"],
  Q: ["quaresma", "queiroz"],
  R: ["raul", "reus", "ribery", "rice", "rijkaard", "riquelme", "rivaldo", "robben", "roberto carlos", "rodri", "rogerio", "ronaldinho", "ronaldo", "rooney", "roberto baggio", "roy keane", "rui costa", "rush", "ryan giggs"],
  S: ["salah", "sammer", "sancho", "sane", "savicevic", "scholes", "schweinsteiger", "seedorf", "sergio ramos", "shearer", "shevchenko", "silva", "sneijder", "son", "southgate", "sterling", "stoichkov", "suarez", "suker", "szczesny"],
  T: ["tammy abraham", "terry", "thiago", "thomas muller", "thorgan hazard", "thuram", "tim cahill", "toni", "tony adams", "torres", "totti", "toure", "trent alexander-arnold", "trezeguet", "trossard"],
  U: ["unai emery", "upson", "uth"],
  V: ["valbuena", "valencia", "van basten", "van de beek", "van der sar", "van dijk", "van nistelrooy", "van persie", "varane", "veron", "verratti", "vidić", "viera", "villa", "vinicius", "vlahovic", "voller"],
  W: ["waddle", "walker", "walcott", "wallace", "wambach", "wan-bissaka", "wenger", "werner", "wilshere", "winks", "wirtz", "wright", "wout weghorst", "wylan"],
  X: ["xabi alonso", "xavi", "xavi simons", "xhaka", "xherdan shaqiri"],
  Y: ["yamal", "yashin", "yaya toure", "yorke", "young"],
  Z: ["zaha", "zanetti", "zico", "zidane", "zinchenko", "ziyech", "zola", "zouma"],
}

export const FOOTBALL_AZ_TIME_LIMIT = 60
export const FOOTBALL_AZ_LETTERS_PER_GAME = 20

export interface JeopardyTile {
  category: string
  points: number
  question: string
  answer: string
}

export const FOOTBALL_JEOPARDY_TILES: JeopardyTile[] = [
  { category: "World Cup Winners", points: 100, question: "Which country won the first World Cup in 1930?", answer: "Uruguay" },
  { category: "World Cup Winners", points: 100, question: "Which country has won the most World Cups?", answer: "Brazil" },
  { category: "World Cup Winners", points: 200, question: "Which country won the 2018 World Cup?", answer: "France" },
  { category: "World Cup Winners", points: 200, question: "Which country won the 2010 World Cup?", answer: "Spain" },
  { category: "World Cup Winners", points: 300, question: "Which country won the 1998 World Cup as hosts?", answer: "France" },
  { category: "World Cup Winners", points: 300, question: "Who was the top scorer of the 2014 World Cup?", answer: "James Rodríguez" },
  { category: "Transfer Records", points: 100, question: "Which player moved from Tottenham to Manchester City for a record £100m in 2021?", answer: "Jack Grealish" },
  { category: "Transfer Records", points: 100, question: "Who became the most expensive defender when moving to Manchester United in 2019?", answer: "Harry Maguire" },
  { category: "Transfer Records", points: 200, question: "Which club paid €222m for Neymar in 2017?", answer: "Paris Saint-Germain" },
  { category: "Transfer Records", points: 200, question: "How much did Manchester United pay for Paul Pogba in 2016?", answer: "£89m" },
  { category: "Transfer Records", points: 300, question: "Who was the first £1m footballer when moving to Juventus in 1984?", answer: "Michel Platini" },
  { category: "Transfer Records", points: 300, question: "Which player moved from Benfica to Atletico Madrid for €126m in 2019?", answer: "João Félix" },
  { category: "Premier League Legends", points: 100, question: "Which player has the most Premier League goals?", answer: "Alan Shearer" },
  { category: "Premier League Legends", points: 100, question: "Which player has the most Premier League assists?", answer: "Ryan Giggs" },
  { category: "Premier League Legends", points: 200, question: "Which goalkeeper has the most Premier League clean sheets?", answer: "Petr Čech" },
  { category: "Premier League Legends", points: 200, question: "Which player has the most Premier League appearances?", answer: "Gareth Barry" },
  { category: "Premier League Legends", points: 300, question: "Who scored the fastest Premier League goal (7.69 seconds)?", answer: "Shane Long" },
  { category: "Premier League Legends", points: 300, question: "Which team went invincible in the 2003-04 Premier League season?", answer: "Arsenal" },
  { category: "European Glory", points: 100, question: "Which club has won the most Champions League titles?", answer: "Real Madrid" },
  { category: "European Glory", points: 100, question: "Who scored the winning goal in the 1999 Champions League final?", answer: "Ole Gunnar Solskjær" },
  { category: "European Glory", points: 200, question: "Which city hosted the 2005 Champions League final (Istanbul Miracle)?", answer: "Istanbul" },
  { category: "European Glory", points: 200, question: "Which player has won the most Champions League titles?", answer: "Francisco Gento" },
  { category: "European Glory", points: 300, question: "Which club won the Champions League in 2012 after beating Bayern Munich in the final?", answer: "Chelsea" },
  { category: "European Glory", points: 300, question: "Who scored the famous 'Panenka' penalty in the 1976 European Championship final?", answer: "Antonín Panenka" },
  { category: "Ballon d'Or Winners", points: 100, question: "Who won the Ballon d'Or in 2023?", answer: "Lionel Messi" },
  { category: "Ballon d'Or Winners", points: 100, question: "Which player won the Ballon d'Or in 2022?", answer: "Karim Benzema" },
  { category: "Ballon d'Or Winners", points: 200, question: "Which goalkeeper won the Ballon d'Or in 1963?", answer: "Lev Yashin" },
  { category: "Ballon d'Or Winners", points: 200, question: "Who won the Ballon d'Or the most times?", answer: "Lionel Messi" },
  { category: "Ballon d'Or Winners", points: 300, question: "Which year did Cristiano Ronaldo win his first Ballon d'Or?", answer: "2008" },
  { category: "Ballon d'Or Winners", points: 300, question: "Which defender won the Ballon d'Or in 2006?", answer: "Fabio Cannavaro" },
  { category: "Iconic Goalscorers", points: 100, question: "Who scored the most goals in a single Premier League season (38 games)?", answer: "Erling Haaland" },
  { category: "Iconic Goalscorers", points: 100, question: "Who scored the bicycle kick goal for Manchester United in the 2011 Premier League?", answer: "Wayne Rooney" },
  { category: "Iconic Goalscorers", points: 200, question: "Who scored the 'Goal of the Century' for Argentina in 1986?", answer: "Diego Maradona" },
  { category: "Iconic Goalscorers", points: 200, question: "Which player scored a hat-trick in the 2022 World Cup final?", answer: "Kylian Mbappé" },
  { category: "Iconic Goalscorers", points: 300, question: "Who scored the winning goal in the 2014 World Cup final?", answer: "Mario Götze" },
  { category: "Iconic Goalscorers", points: 300, question: "Which player scored the fastest goal in World Cup history (11 seconds)?", answer: "Hakan Şükür" },
  { category: "Managers", points: 100, question: "Which manager has won the most Premier League titles?", answer: "Sir Alex Ferguson" },
  { category: "Managers", points: 100, question: "Which manager led Leicester City to the Premier League title in 2016?", answer: "Claudio Ranieri" },
  { category: "Managers", points: 200, question: "Who was the manager of Barcelona during their 2009 sextuple-winning season?", answer: "Pep Guardiola" },
  { category: "Managers", points: 200, question: "Which manager has won the Champions League with two different clubs?", answer: "Jose Mourinho" },
  { category: "Managers", points: 300, question: "Who managed the Netherlands to the 2010 World Cup final?", answer: "Bert van Marwijk" },
  { category: "Managers", points: 300, question: "Which manager led AC Milan to two Champions League titles in the 2000s?", answer: "Carlo Ancelotti" },
]

export const FOOTBALL_JEOPARDY_TILES_PER_SESSION = 6

export interface TriviaPathQuestion {
  question: string
  options: string[]
  correctIndex: number
  difficulty: "easy" | "medium" | "hard"
}

export const TRIVIA_PATH_QUESTIONS: TriviaPathQuestion[] = [
  { question: "Which country has won the most World Cup titles?", options: ["Brazil", "Germany", "Italy", "Argentina"], correctIndex: 0, difficulty: "easy" },
  { question: "Who is the all-time top scorer in World Cup history?", options: ["Miroslav Klose", "Ronaldo Nazário", "Lionel Messi", "Pelé"], correctIndex: 0, difficulty: "easy" },
  { question: "Which club has won the most Champions League titles?", options: ["Real Madrid", "AC Milan", "Bayern Munich", "Liverpool"], correctIndex: 0, difficulty: "easy" },
  { question: "Who won the Ballon d'Or in 2022?", options: ["Karim Benzema", "Lionel Messi", "Robert Lewandowski", "Kylian Mbappé"], correctIndex: 0, difficulty: "easy" },
  { question: "How many players are on a football team (including goalkeeper)?", options: ["10", "11", "12", "9"], correctIndex: 1, difficulty: "easy" },
  { question: "Which country hosted the 2014 World Cup?", options: ["Brazil", "Russia", "South Africa", "Germany"], correctIndex: 0, difficulty: "easy" },
  { question: "Who is the Premier League's all-time top scorer?", options: ["Alan Shearer", "Wayne Rooney", "Harry Kane", "Thierry Henry"], correctIndex: 0, difficulty: "easy" },
  { question: "Which club did Lionel Messi play for before moving to Inter Miami?", options: ["Paris Saint-Germain", "Barcelona", "Manchester City", "Chelsea"], correctIndex: 0, difficulty: "easy" },
  { question: "What color card does a referee show for a second bookable offense?", options: ["Yellow", "Red", "Orange", "Blue"], correctIndex: 1, difficulty: "easy" },
  { question: "Which country won the 2018 World Cup?", options: ["France", "Croatia", "Belgium", "England"], correctIndex: 0, difficulty: "easy" },
  { question: "Who scored 'The Hand of God' goal?", options: ["Diego Maradona", "Pelé", "Lionel Messi", "Cristiano Ronaldo"], correctIndex: 0, difficulty: "medium" },
  { question: "Which team went unbeaten for an entire Premier League season?", options: ["Arsenal", "Chelsea", "Manchester United", "Manchester City"], correctIndex: 0, difficulty: "medium" },
  { question: "Who is the only goalkeeper to win the Ballon d'Or?", options: ["Lev Yashin", "Gianluigi Buffon", "Peter Schmeichel", "Manuel Neuer"], correctIndex: 0, difficulty: "medium" },
  { question: "Which country invented modern football (the FA was formed there)?", options: ["England", "Brazil", "Italy", "Scotland"], correctIndex: 0, difficulty: "medium" },
  { question: "Which player has the most international goals of all time?", options: ["Cristiano Ronaldo", "Lionel Messi", "Ali Daei", "Pelé"], correctIndex: 0, difficulty: "medium" },
  { question: "Who scored the fastest goal in World Cup history?", options: ["Hakan Şükür", "Clint Dempsey", "Robbie Keane", "Brett Emerton"], correctIndex: 0, difficulty: "medium" },
  { question: "Which stadium hosted the 2005 Champions League final (the 'Istanbul Miracle')?", options: ["Atatürk Olympic Stadium", "Şükrü Saracoğlu Stadium", "Ali Sami Yen Stadium", "Olympic Stadium Munich"], correctIndex: 0, difficulty: "medium" },
  { question: "How long is a standard football match?", options: ["90 minutes", "80 minutes", "100 minutes", "60 minutes"], correctIndex: 0, difficulty: "easy" },
  { question: "Which club did Johan Cruyff famously play for?", options: ["Ajax", "PSV Eindhoven", "Feyenoord", "Utrecht"], correctIndex: 0, difficulty: "medium" },
  { question: "What is the maximum number of substitutes allowed in a Premier League match?", options: ["5", "3", "7", "4"], correctIndex: 0, difficulty: "hard" },
  { question: "Which year was the first Ballon d'Or awarded?", options: ["1956", "1930", "1960", "1945"], correctIndex: 0, difficulty: "hard" },
  { question: "Who scored the winning goal in the 1999 Champions League final?", options: ["Ole Gunnar Solskjær", "Teddy Sheringham", "Ryan Giggs", "David Beckham"], correctIndex: 0, difficulty: "hard" },
  { question: "Which club has won the most consecutive Premier League titles?", options: ["Manchester City", "Manchester United", "Chelsea", "Arsenal"], correctIndex: 0, difficulty: "hard" },
  { question: "Who is the only player to have won the World Cup, Champions League, and Ballon d'Or in the same year?", options: ["Kylian Mbappé", "Zinedine Zidane", "Lionel Messi", "Ronaldo Nazário"], correctIndex: 2, difficulty: "hard" },
  { question: "Which country won the first ever European Championship in 1960?", options: ["Soviet Union", "West Germany", "Spain", "France"], correctIndex: 0, difficulty: "hard" },
  { question: "Who holds the record for most goals in a single Premier League season (38 games)?", options: ["Erling Haaland", "Mohamed Salah", "Alan Shearer", "Cristiano Ronaldo"], correctIndex: 0, difficulty: "hard" },
  { question: "Which stadium is known as 'The Theatre of Dreams'?", options: ["Old Trafford", "Camp Nou", "Wembley", "Santiago Bernabéu"], correctIndex: 0, difficulty: "easy" },
  { question: "Which manager has won the most Premier League titles?", options: ["Sir Alex Ferguson", "Pep Guardiola", "Arsène Wenger", "José Mourinho"], correctIndex: 0, difficulty: "easy" },
  { question: "Which country has won the most European Championship titles?", options: ["Spain", "Germany", "France", "Italy"], correctIndex: 0, difficulty: "medium" },
  { question: "Who was the first player to score 100 Champions League goals?", options: ["Cristiano Ronaldo", "Lionel Messi", "Raúl", "Karim Benzema"], correctIndex: 2, difficulty: "hard" },
  { question: "Which country won the 2022 World Cup?", options: ["Argentina", "France", "Brazil", "England"], correctIndex: 0, difficulty: "easy" },
  { question: "Who is the all-time top scorer in Premier League history?", options: ["Alan Shearer", "Harry Kane", "Wayne Rooney", "Andy Cole"], correctIndex: 0, difficulty: "easy" },
  { question: "Which club did Cristiano Ronaldo play for before joining Manchester United in 2021?", options: ["Juventus", "Real Madrid", "Sporting CP", "Al-Nassr"], correctIndex: 0, difficulty: "easy" },
  { question: "What is the diameter of a standard football goal?", options: ["24 ft × 8 ft", "22 ft × 7 ft", "26 ft × 9 ft", "20 ft × 8 ft"], correctIndex: 0, difficulty: "medium" },
  { question: "Which player has the most assists in Champions League history?", options: ["Cristiano Ronaldo", "Lionel Messi", "Ryan Giggs", "Angel Di Maria"], correctIndex: 1, difficulty: "medium" },
  { question: "Which country has never missed a World Cup tournament?", options: ["Brazil", "Germany", "Italy", "Argentina"], correctIndex: 0, difficulty: "medium" },
  { question: "Who invented the 'Cruyff Turn'?", options: ["Johan Cruyff", "Pep Guardiola", "Marco van Basten", "Ruud Gullit"], correctIndex: 0, difficulty: "easy" },
  { question: "Which English club has never been relegated from the Premier League?", options: ["Arsenal", "Everton", "Liverpool", "Manchester United"], correctIndex: 2, difficulty: "hard" },
  { question: "Who scored the goal that sent Argentina to the 2022 World Cup final?", options: ["Lionel Messi", "Julian Alvarez", "Nahuel Molina", "Angel Di Maria"], correctIndex: 0, difficulty: "hard" },
  { question: "Which club has won the most Europa League titles?", options: ["Sevilla", "Juventus", "Inter Milan", "Atletico Madrid"], correctIndex: 0, difficulty: "medium" },
  { question: "What year did women's football become an Olympic sport?", options: ["1996", "2000", "2004", "1992"], correctIndex: 0, difficulty: "hard" },
]

export const TRIVIA_PATH_TILES_PER_SESSION = 6

export interface TicTacToeGridData {
  id: number
  rows: string[]
  cols: string[]
  cells: string[][][]
}

export const TIC_TAC_TOE_GRIDS: TicTacToeGridData[] = [
  {
    id: 1,
    rows: ["Played for Barcelona", "Played for Real Madrid", "Played for Man United"],
    cols: ["Won the World Cup", "Won the Champions League", "Won the Ballon d'Or"],
    cells: [
      [
        ["xavi", "iniesta", "puyol", "villa", "ronaldinho", "henry", "neymar", "hierro"],
        ["messi", "xavi", "iniesta", "ronaldinho", "neymar", "deco", "rivaldo", "ronald koeman"],
        ["messi", "ronaldinho", "rivaldo", "stoichkov", "cruyff", "neymar", "kubala"],
      ],
      [
        ["zidane", "ronaldo", "ramos", "casillas", "varane", "kroos", "cannavaro"],
        ["zidane", "ronaldo", "modric", "ramos", "kroos", "raul", "morientes"],
        ["zidane", "ronaldo", "modric", "figo", "cannavaro", "cristiano ronaldo"],
      ],
      [
        ["charlton", "stiles", "pogba", "varane"],
        ["charlton", "best", "giggs", "rooney", "scholes", "keane", "beckham", "irwin"],
        ["charlton", "denis law", "best", "cristiano ronaldo", "beckham", "rooney", "cantona"],
      ],
    ],
  },
  {
    id: 2,
    rows: ["Played for Liverpool", "Played for Arsenal", "Played for Chelsea"],
    cols: ["Premier League Winner", "Champions League Winner", "FA Cup Winner"],
    cells: [
      [
        ["fowler", "barnes", "van dijk", "salah", "alisson"],
        ["gerrard", "carragher", "alonso", "salah", "alisson", "van dijk", "dalglis", "hyypia"],
        ["gerrard", "fowler", "rush", "barnes", "dalglis", "hansen"],
      ],
      [
        ["bergkamp", "tony adams", "henry", "viera", "sol campbell", "parlour", "dixon", "keown", "fabregas"],
        ["bergkamp", "henry", "fabregas", "petit", "overmars", "silvinho"],
        ["bergkamp", "henry", "tony adams", "ian wright", "parlour", "dixon", "smith"],
      ],
      [
        ["terry", "lampard", "drogba", "cech", "ashley cole", "ivanovic", "cahill", "mata"],
        ["terry", "lampard", "drogba", "cech", "ashley cole", "joe cole", "ivanovic"],
        ["terry", "lampard", "drogba", "cech", "hazard", "mata", "ramires"],
      ],
    ],
  },
  {
    id: 3,
    rows: ["Played in La Liga", "Played in the Premier League", "Played in Serie A"],
    cols: ["Won the Ballon d'Or", "Scored 200+ League Goals", "Captained Their National Team"],
    cells: [
      [
        ["messi", "ronaldinho", "figo", "zidane", "cristiano ronaldo", "modric", "benzema", "ronaldo"],
        ["messi", "cristiano ronaldo", "zarra", "hugo sanchez", "raul", "benzema"],
        ["messi", "raul", "xavi", "casillas", "ramos", "puyol", "cristiano ronaldo", "benzema", "hugo sanchez"],
      ],
      [
        ["cristiano ronaldo", "owen", "keegan", "best", "shevchenko"],
        ["shearer", "rooney", "henry", "kane", "lampard", "cole", "aguero", "cristiano ronaldo"],
        ["rooney", "gerrard", "terry", "kane", "henry", "viera", "keane", "keegan"],
      ],
      [
        ["kaka", "shevchenko", "baggio", "pirlo", "nedved", "weah", "ronaldo"],
        ["piola", "nordahl", "totti", "del piero", "shevchenko", "higuaín", "ibrahimovic"],
        ["totti", "del piero", "maldini", "buffon", "baresi", "zanetti", "pirlo", "cannavaro"],
      ],
    ],
  },
  {
    id: 4,
    rows: ["Played for Bayern Munich", "Played for Juventus", "Played for AC Milan"],
    cols: ["Won the World Cup", "Won the Champions League", "Played in 3+ Leagues"],
    cells: [
      [
        ["kahn", "lahm", "schweinsteiger", "muller", "neuer", "kroos", "klose", "beckenbauer", "breitner", "augenthaler"],
        ["kahn", "lahm", "schweinsteiger", "muller", "neuer", "kroos", "sagnol"],
        ["kahn", "lahm", "schweinsteiger", "kroos", "ballack"],
      ],
      [
        ["zidane", "deschamps", "pirlo", "del piero", "buffon", "platini", "rossi", "cabrini", "scirea", "tardelli"],
        ["zidane", "pirlo", "del piero", "platini", "nedved", "trezeguet", "seedorf", "davids"],
        ["zidane", "nedved", "pogba", "ibrahimovic", "davids", "viera", "cannavaro"],
      ],
      [
        ["nesta", "pirlo", "gattuso", "ronaldo", "cafu", "vogel"],
        ["maldini", "baresi", "costacurta", "nesta", "pirlo", "gattuso", "shevchenko", "kaka", "seedorf"],
        ["ibrahimovic", "ronaldinho", "beckham", "kaka", "shevchenko", "crespo", "redondo", "dida", "cafu"],
      ],
    ],
  },
  {
    id: 5,
    rows: ["Played for Dortmund", "Played for Atletico Madrid", "Played for Inter Milan"],
    cols: ["Won Domestic League", "Scored in a Cup Final", "Played in 3+ Leagues"],
    cells: [
      [
        ["lewa", "gotze", "hummels", "reus", "aubameyang", "kagawa", "kehl", "dede"],
        ["reus", "aubameyang", "lewa", "kagawa", "piszczek"],
        ["lewa", "aubameyang", "kagawa", "pulisic", "sahin", "rosicky", "mkhitaryan"],
      ],
      [
        ["torres", "griezmann", "falcao", "godin", "koke", "gabi", "simeone", "juanfran", "tiago"],
        ["torres", "griezmann", "falcao", "koke"],
        ["torres", "falcao", "david villa", "courtois", "forlan", "diego"],
      ],
      [
        ["zanetti", "milito", "cambiasso", "sneijder", "ibrahimovic", "etoo", "cordoba", "samuel", "stankovic"],
        ["zanetti", "milito", "sneijder", "etoo", "pandev", "cambiasso"],
        ["ibrahimovic", "cambiasso", "crespo", "veron", "djorkaeff", "seedorf", "ronaldo", "eto'o", "figo"],
      ],
    ],
  },
  {
    id: 6,
    rows: ["African Footballer of the Year", "World Cup Golden Ball", "Premier League Legend"],
    cols: ["Played in England", "Played in Spain", "Played in Italy"],
    cells: [
      [
        ["etoo", "drogba", "yaya toure", "salah", "mane", "aubameyang", "kanu"],
        ["etoo", "yaya toure", "aubameyang"],
        ["etoo", "weah", "milla", "geremi"],
      ],
      [
        ["modric", "forlan", "messi", "kane"],
        ["modric", "messi", "forlan", "ronaldo", "zidane"],
        ["modric", "cannavaro", "ronaldo", "zidane"],
      ],
      [
        ["shearer", "henry", "lampard", "gerrard", "scholes", "rooney", "kane"],
        ["henry", "beckham", "bale", "cristiano ronaldo", "owen", "lineker"],
        ["platt", "gascogne", "lineker", "zola", "vialli", "crespo"],
      ],
    ],
  },
  {
    id: 7,
    rows: ["Won the Copa America", "Won the AFCON", "Won the Euros"],
    cols: ["Played in Europe's Top 5 Leagues", "Scored in a World Cup", "Club Captain"],
    cells: [
      [
        ["messi", "neymar", "ronaldo", "suarez", "di maria", "cafu", "ronaldinho"],
        ["messi", "ronaldo", "pele", "kaka", "zico", "batistuta", "crespo", "higuain"],
        ["messi", "maradona", "zanetti", "cafu", "gerson", "dunga", "tevez"],
      ],
      [
        ["etoo", "drogba", "salah", "mane", "yaya toure", "aubameyang", "mahrez", "osimhen"],
        ["etoo", "drogba", "salah", "mane", "weah", "milla", "osimhen"],
        ["etoo", "drogba", "yaya toure", "salah", "mane", "aubameyang", "kanu"],
      ],
      [
        ["ronaldo", "zidane", "muller", "iniesta", "xavi", "pirlo", "buffon", "neuer"],
        ["ronaldo", "zidane", "muller", "griezmann", "shevchenko", "cristiano ronaldo", "morata"],
        ["zidane", "pirlo", "casillas", "neuer", "ramos", "maldini", "cristiano ronaldo"],
      ],
    ],
  },
  {
    id: 8,
    rows: ["Played in the 2014 World Cup", "Played in the 2018 World Cup", "Played in the 2022 World Cup"],
    cols: ["Scored in a World Cup knockout match", "Captained their national team", "Played for a club in Spain"],
    cells: [
      [
        ["messi", "neymar", "muller", "james", "robben", "van persie", "higuain", "klose"],
        ["messi", "neymar", "ramos", "lahm", "buffon", "gerrard", "cristiano ronaldo"],
        ["messi", "neymar", "ramos", "iniesta", "xavi", "modric", "cristiano ronaldo", "benzema"],
      ],
      [
        ["mbappe", "modric", "kane", "griezmann", "hazard", "lukaku", "ronaldo"],
        ["mbappe", "modric", "kane", "ronaldo", "hazard", "zaha", "cavani"],
        ["mbappe", "modric", "courtois", "hazard", "ronaldo", "isco", "asensio"],
      ],
      [
        ["messi", "mbappe", "giroud", "alvarez", "richarlison", "rashford"],
        ["messi", "mbappe", "kane", "neymar", "modric", "ronaldo"],
        ["messi", "mbappe", "neymar", "modric", ""],
      ],
    ],
  },
]

export const TIC_TAC_TOE_TIME_LIMIT = 90

export interface KitClub {
  name: string
  primary: string
  secondary: string
  pattern: "stripes" | "hoops" | "solid" | "sash" | "quarters"
}

export const KIT_CLUBS: KitClub[] = [
  { name: "Arsenal", primary: "#EF0107", secondary: "#FFFFFF", pattern: "solid" },
  { name: "Barcelona", primary: "#A50044", secondary: "#004D98", pattern: "stripes" },
  { name: "Real Madrid", primary: "#FFFFFF", secondary: "#FEBE10", pattern: "solid" },
  { name: "Juventus", primary: "#000000", secondary: "#FFFFFF", pattern: "stripes" },
  { name: "AC Milan", primary: "#FB090B", secondary: "#000000", pattern: "stripes" },
  { name: "Liverpool", primary: "#C8102E", secondary: "#FFFFFF", pattern: "solid" },
  { name: "Manchester United", primary: "#DA291C", secondary: "#FFFFFF", pattern: "solid" },
  { name: "Chelsea", primary: "#034694", secondary: "#FFFFFF", pattern: "solid" },
  { name: "Manchester City", primary: "#6CABDD", secondary: "#FFFFFF", pattern: "solid" },
  { name: "Bayern Munich", primary: "#DC052D", secondary: "#FFFFFF", pattern: "solid" },
  { name: "Paris Saint-Germain", primary: "#004170", secondary: "#DA291C", pattern: "solid" },
  { name: "Ajax", primary: "#C8102E", secondary: "#FFFFFF", pattern: "stripes" },
  { name: "Celtic", primary: "#00985F", secondary: "#FFFFFF", pattern: "hoops" },
  { name: "Borussia Dortmund", primary: "#FDE100", secondary: "#000000", pattern: "stripes" },
  { name: "Atlético Madrid", primary: "#CB3524", secondary: "#FFFFFF", pattern: "stripes" },
  { name: "Napoli", primary: "#12A0D6", secondary: "#FFFFFF", pattern: "solid" },
  { name: "Benfica", primary: "#E10909", secondary: "#FFFFFF", pattern: "quarters" },
  { name: "Sporting CP", primary: "#008040", secondary: "#FFFFFF", pattern: "stripes" },
  { name: "River Plate", primary: "#FFFFFF", secondary: "#DA291C", pattern: "sash" },
  { name: "Boca Juniors", primary: "#004070", secondary: "#F8C300", pattern: "sash" },
]

export const KIT_ROUNDS = 5
export const KIT_TOTAL_STAGES = 3

export const SHARE_THEMES = {
  DARK: "dark",
  LIGHT: "light",
  COPPER: "copper",
} as const

export type ShareTheme = (typeof SHARE_THEMES)[keyof typeof SHARE_THEMES]

// ── Formation Builder ────────────────────────────────────────────────

export interface FormationPosition {
  pos: string
  label: string
  x: number // percentage from left (0-100)
  y: number // percentage from top (0-100)
}

export interface Formation {
  id: string
  name: string
  description: string
  positions: FormationPosition[]
}

export const FORMATIONS: Formation[] = [
  {
    id: "4-4-2",
    name: "4-4-2",
    description: "Classic balanced formation",
    positions: [
      { pos: "GK", label: "GK", x: 50, y: 90 },
      { pos: "LB", label: "LB", x: 15, y: 72 },
      { pos: "CB", label: "CB", x: 38, y: 75 },
      { pos: "CB", label: "CB", x: 62, y: 75 },
      { pos: "RB", label: "RB", x: 85, y: 72 },
      { pos: "LM", label: "LM", x: 15, y: 48 },
      { pos: "CM", label: "CM", x: 38, y: 50 },
      { pos: "CM", label: "CM", x: 62, y: 50 },
      { pos: "RM", label: "RM", x: 85, y: 48 },
      { pos: "ST", label: "ST", x: 38, y: 22 },
      { pos: "ST", label: "ST", x: 62, y: 22 },
    ],
  },
  {
    id: "4-3-3",
    name: "4-3-3",
    description: "Attacking width with wingers",
    positions: [
      { pos: "GK", label: "GK", x: 50, y: 90 },
      { pos: "LB", label: "LB", x: 15, y: 72 },
      { pos: "CB", label: "CB", x: 38, y: 75 },
      { pos: "CB", label: "CB", x: 62, y: 75 },
      { pos: "RB", label: "RB", x: 85, y: 72 },
      { pos: "CM", label: "CM", x: 30, y: 50 },
      { pos: "CDM", label: "CDM", x: 50, y: 55 },
      { pos: "CM", label: "CM", x: 70, y: 50 },
      { pos: "LW", label: "LW", x: 15, y: 25 },
      { pos: "ST", label: "ST", x: 50, y: 18 },
      { pos: "RW", label: "RW", x: 85, y: 25 },
    ],
  },
  {
    id: "3-5-2",
    name: "3-5-2",
    description: "Midfield dominance with wing-backs",
    positions: [
      { pos: "GK", label: "GK", x: 50, y: 90 },
      { pos: "CB", label: "CB", x: 25, y: 75 },
      { pos: "CB", label: "CB", x: 50, y: 78 },
      { pos: "CB", label: "CB", x: 75, y: 75 },
      { pos: "LWB", label: "LWB", x: 10, y: 50 },
      { pos: "CM", label: "CM", x: 35, y: 50 },
      { pos: "CDM", label: "CDM", x: 50, y: 55 },
      { pos: "CM", label: "CM", x: 65, y: 50 },
      { pos: "RWB", label: "RWB", x: 90, y: 50 },
      { pos: "ST", label: "ST", x: 38, y: 22 },
      { pos: "ST", label: "ST", x: 62, y: 22 },
    ],
  },
  {
    id: "4-2-3-1",
    name: "4-2-3-1",
    description: "Fluid attack with double pivot",
    positions: [
      { pos: "GK", label: "GK", x: 50, y: 90 },
      { pos: "LB", label: "LB", x: 15, y: 72 },
      { pos: "CB", label: "CB", x: 38, y: 75 },
      { pos: "CB", label: "CB", x: 62, y: 75 },
      { pos: "RB", label: "RB", x: 85, y: 72 },
      { pos: "CDM", label: "CDM", x: 38, y: 55 },
      { pos: "CDM", label: "CDM", x: 62, y: 55 },
      { pos: "LAM", label: "LAM", x: 20, y: 38 },
      { pos: "CAM", label: "CAM", x: 50, y: 40 },
      { pos: "RAM", label: "RAM", x: 80, y: 38 },
      { pos: "ST", label: "ST", x: 50, y: 18 },
    ],
  },
  {
    id: "3-4-3",
    name: "3-4-3",
    description: "Aggressive width and pressing",
    positions: [
      { pos: "GK", label: "GK", x: 50, y: 90 },
      { pos: "CB", label: "CB", x: 25, y: 75 },
      { pos: "CB", label: "CB", x: 50, y: 78 },
      { pos: "CB", label: "CB", x: 75, y: 75 },
      { pos: "LM", label: "LM", x: 15, y: 50 },
      { pos: "CM", label: "CM", x: 40, y: 52 },
      { pos: "CM", label: "CM", x: 60, y: 52 },
      { pos: "RM", label: "RM", x: 85, y: 50 },
      { pos: "LW", label: "LW", x: 18, y: 25 },
      { pos: "ST", label: "ST", x: 50, y: 18 },
      { pos: "RW", label: "RW", x: 82, y: 25 },
    ],
  },
  {
    id: "5-3-2",
    name: "5-3-2",
    description: "Solid defense with counter-attack",
    positions: [
      { pos: "GK", label: "GK", x: 50, y: 90 },
      { pos: "LWB", label: "LWB", x: 10, y: 55 },
      { pos: "CB", label: "CB", x: 28, y: 75 },
      { pos: "CB", label: "CB", x: 50, y: 78 },
      { pos: "CB", label: "CB", x: 72, y: 75 },
      { pos: "RWB", label: "RWB", x: 90, y: 55 },
      { pos: "CM", label: "CM", x: 35, y: 48 },
      { pos: "CM", label: "CM", x: 50, y: 52 },
      { pos: "CM", label: "CM", x: 65, y: 48 },
      { pos: "ST", label: "ST", x: 38, y: 22 },
      { pos: "ST", label: "ST", x: 62, y: 22 },
    ],
  },
  {
    id: "4-1-4-1",
    name: "4-1-4-1",
    description: "Compact midfield with single striker",
    positions: [
      { pos: "GK", label: "GK", x: 50, y: 90 },
      { pos: "LB", label: "LB", x: 15, y: 72 },
      { pos: "CB", label: "CB", x: 38, y: 75 },
      { pos: "CB", label: "CB", x: 62, y: 75 },
      { pos: "RB", label: "RB", x: 85, y: 72 },
      { pos: "CDM", label: "CDM", x: 50, y: 58 },
      { pos: "LM", label: "LM", x: 15, y: 42 },
      { pos: "CM", label: "CM", x: 38, y: 45 },
      { pos: "CM", label: "CM", x: 62, y: 45 },
      { pos: "RM", label: "RM", x: 85, y: 42 },
      { pos: "ST", label: "ST", x: 50, y: 18 },
    ],
  },
  {
    id: "4-4-1-1",
    name: "4-4-1-1",
    description: "Classic with a second striker",
    positions: [
      { pos: "GK", label: "GK", x: 50, y: 90 },
      { pos: "LB", label: "LB", x: 15, y: 72 },
      { pos: "CB", label: "CB", x: 38, y: 75 },
      { pos: "CB", label: "CB", x: 62, y: 75 },
      { pos: "RB", label: "RB", x: 85, y: 72 },
      { pos: "LM", label: "LM", x: 15, y: 48 },
      { pos: "CM", label: "CM", x: 38, y: 50 },
      { pos: "CM", label: "CM", x: 62, y: 50 },
      { pos: "RM", label: "RM", x: 85, y: 48 },
      { pos: "CF", label: "CF", x: 50, y: 30 },
      { pos: "ST", label: "ST", x: 50, y: 18 },
    ],
  },
]

export interface HistoricLineupPlayer {
  name: string
  position: string
  // optional override for search; defaults to name
  searchName?: string
}

export interface HistoricLineup {
  id: string
  team: string
  year: string
  formation: string
  label: string
  players: HistoricLineupPlayer[]
}

export const HISTORIC_LINEUPS: HistoricLineup[] = [
  {
    id: "barca-2009",
    team: "Barcelona",
    year: "2009",
    formation: "4-3-3",
    label: "Barcelona 2009 — Sextuple",
    players: [
      { name: "Victor Valdes", position: "GK" },
      { name: "Dani Alves", position: "RB" },
      { name: "Gerard Piqué", position: "CB" },
      { name: "Carles Puyol", position: "CB" },
      { name: "Eric Abidal", position: "LB" },
      { name: "Sergio Busquets", position: "CDM" },
      { name: "Xavi Hernandez", position: "CM" },
      { name: "Andres Iniesta", position: "CM" },
      { name: "Lionel Messi", position: "RW" },
      { name: "Samuel Eto'o", position: "ST" },
      { name: "Thierry Henry", position: "LW" },
    ],
  },
  {
    id: "real-madrid-2017",
    team: "Real Madrid",
    year: "2017",
    formation: "4-3-3",
    label: "Real Madrid 2017 — La Décima",
    players: [
      { name: "Keylor Navas", position: "GK" },
      { name: "Dani Carvajal", position: "RB" },
      { name: "Sergio Ramos", position: "CB" },
      { name: "Raphael Varane", position: "CB" },
      { name: "Marcelo", position: "LB" },
      { name: "Casemiro", position: "CDM" },
      { name: "Luka Modric", position: "CM" },
      { name: "Toni Kroos", position: "CM" },
      { name: "Isco", position: "RW" },
      { name: "Karim Benzema", position: "ST" },
      { name: "Cristiano Ronaldo", position: "LW" },
    ],
  },
  {
    id: "liverpool-2005",
    team: "Liverpool",
    year: "2005",
    formation: "4-4-1-1",
    label: "Liverpool 2005 — Istanbul Miracle",
    players: [
      { name: "Jerzy Dudek", position: "GK" },
      { name: "Steve Finnan", position: "RB" },
      { name: "Jamie Carragher", position: "CB" },
      { name: "Sami Hyypia", position: "CB" },
      { name: "John Arne Riise", position: "LB" },
      { name: "Steven Gerrard", position: "CM" },
      { name: "Xabi Alonso", position: "CM" },
      { name: "Luis Garcia", position: "RM" },
      { name: "Harry Kewell", position: "LM" },
      { name: "Milan Baros", position: "CF" },
      { name: "Djibril Cisse", position: "ST" },
    ],
  },
  {
    id: "man-utd-1999",
    team: "Manchester United",
    year: "1999",
    formation: "4-4-2",
    label: "Man United 1999 — Treble Winners",
    players: [
      { name: "Peter Schmeichel", position: "GK" },
      { name: "Gary Neville", position: "RB" },
      { name: "Ronny Johnsen", position: "CB" },
      { name: "Jaap Stam", position: "CB" },
      { name: "Denis Irwin", position: "LB" },
      { name: "David Beckham", position: "RM" },
      { name: "Roy Keane", position: "CM" },
      { name: "Paul Scholes", position: "CM" },
      { name: "Ryan Giggs", position: "LM" },
      { name: "Andy Cole", position: "ST" },
      { name: "Dwight Yorke", position: "ST" },
    ],
  },
  {
    id: "ac-milan-2007",
    team: "AC Milan",
    year: "2007",
    formation: "4-3-2-1",
    label: "AC Milan 2007 — Champions League",
    players: [
      { name: "Gianluigi Buffon", position: "GK", searchName: "Gianluigi Buffon Milan" },
      { name: "Cafu", position: "RB" },
      { name: "Paolo Maldini", position: "CB" },
      { name: "Alessandro Nesta", position: "CB" },
      { name: "Filippo Inzaghi", position: "LW" },
      { name: "Gennaro Gattuso", position: "CM" },
      { name: "Andrea Pirlo", position: "CM" },
      { name: "Clarence Seedorf", position: "CM" },
      { name: "Kaka", position: "CF" },
      { name: "Andriy Shevchenko", position: "ST" },
      { name: "Massimo Oddo", position: "LB" },
    ],
  },
  {
    id: "brazil-1970",
    team: "Brazil",
    year: "1970",
    formation: "4-3-3",
    label: "Brazil 1970 — The Beautiful Team",
    players: [
      { name: "Felix", position: "GK" },
      { name: "Carlos Alberto", position: "RB" },
      { name: "Brito", position: "CB" },
      { name: "Wilson Piazza", position: "CB" },
      { name: "Everaldo", position: "LB" },
      { name: "Gerson", position: "CM" },
      { name: "Clodoaldo", position: "CM" },
      { name: "Rivellino", position: "CM" },
      { name: "Jairzinho", position: "RW" },
      { name: "Tostao", position: "ST" },
      { name: "Pele", position: "LW" },
    ],
  },
  {
    id: "ajax-1972",
    team: "Ajax",
    year: "1972",
    formation: "4-3-3",
    label: "Ajax 1972 — Total Football",
    players: [
      { name: "Heinz Stuy", position: "GK" },
      { name: "Wim Suurbier", position: "RB" },
      { name: "Barry Hulshoff", position: "CB" },
      { name: "Ruud Krol", position: "CB" },
      { name: "Wim Jansen", position: "LB" },
      { name: "Johan Neeskens", position: "CM" },
      { name: "Johan Cruyff", position: "CF" },
      { name: "Arie Haan", position: "CM" },
      { name: "Johnny Rep", position: "RW" },
      { name: "Dick van Dijk", position: "ST" },
      { name: "Piet Keizer", position: "LW" },
    ],
  },
  {
    id: "italy-2006",
    team: "Italy",
    year: "2006",
    formation: "4-3-3",
    label: "Italy 2006 — World Cup Champions",
    players: [
      { name: "Gianluigi Buffon", position: "GK" },
      { name: "Gianluca Zambrotta", position: "RB" },
      { name: "Fabio Cannavaro", position: "CB" },
      { name: "Marco Materazzi", position: "CB" },
      { name: "Fabio Grosso", position: "LB" },
      { name: "Gennaro Gattuso", position: "CM" },
      { name: "Andrea Pirlo", position: "CM" },
      { name: "Francesco Totti", position: "CM" },
      { name: "Luca Toni", position: "ST" },
      { name: "Filippo Inzaghi", position: "ST" },
      { name: "Simone Perrotta", position: "LW" },
    ],
  },
  {
    id: "germany-2014",
    team: "Germany",
    year: "2014",
    formation: "4-3-3",
    label: "Germany 2014 — World Cup Winners",
    players: [
      { name: "Manuel Neuer", position: "GK" },
      { name: "Philipp Lahm", position: "RB" },
      { name: "Mats Hummels", position: "CB" },
      { name: "Jerome Boateng", position: "CB" },
      { name: "Benedikt Howedes", position: "LB" },
      { name: "Bastian Schweinsteiger", position: "CM" },
      { name: "Toni Kroos", position: "CM" },
      { name: "Sami Khedira", position: "CM" },
      { name: "Mesut Ozil", position: "RW" },
      { name: "Miroslav Klose", position: "ST" },
      { name: "Thomas Muller", position: "LW" },
    ],
  },
  {
    id: "arsenal-2004",
    team: "Arsenal",
    year: "2004",
    formation: "4-4-2",
    label: "Arsenal 2004 — Invincibles",
    players: [
      { name: "Jens Lehmann", position: "GK" },
      { name: "Lauren", position: "RB" },
      { name: "Sol Campbell", position: "CB" },
      { name: "Kolo Toure", position: "CB" },
      { name: "Ashley Cole", position: "LB" },
      { name: "Robert Pires", position: "RM" },
      { name: "Patrick Vieira", position: "CM" },
      { name: "Gilberto Silva", position: "CM" },
      { name: "Freddie Ljungberg", position: "LM" },
      { name: "Thierry Henry", position: "ST" },
      { name: "Dennis Bergkamp", position: "ST" },
    ],
  },
  {
    id: "france-1998",
    team: "France",
    year: "1998",
    formation: "4-3-3",
    label: "France 1998 — World Cup on Home Soil",
    players: [
      { name: "Fabien Barthez", position: "GK" },
      { name: "Lilian Thuram", position: "RB" },
      { name: "Marcel Desailly", position: "CB" },
      { name: "Laurent Blanc", position: "CB" },
      { name: "Bixente Lizarazu", position: "LB" },
      { name: "Didier Deschamps", position: "CM" },
      { name: "Emmanuel Petit", position: "CM" },
      { name: "Zinedine Zidane", position: "CM" },
      { name: "Youri Djorkaeff", position: "RW" },
      { name: "Stéphane Guivarc'h", position: "ST" },
      { name: "Thierry Henry", position: "LW" },
    ],
  },
  {
    id: "inter-2010",
    team: "Inter Milan",
    year: "2010",
    formation: "4-2-3-1",
    label: "Inter Milan 2010 — Treble Winners",
    players: [
      { name: "Julio Cesar", position: "GK" },
      { name: "Maicon", position: "RB" },
      { name: "Ivan Cordoba", position: "CB" },
      { name: "Walter Samuel", position: "CB" },
      { name: "Luis Figo", position: "LW" },
      { name: "Esteban Cambiasso", position: "CDM" },
      { name: "Wesley Sneijder", position: "CAM" },
      { name: "Dejan Stankovic", position: "CM" },
      { name: "Samuel Eto'o", position: "RW" },
      { name: "Diego Milito", position: "ST" },
      { name: "Javier Zanetti", position: "LB" },
    ],
  },
]
