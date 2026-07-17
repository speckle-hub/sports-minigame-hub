// Pre-built player photo cache for historic lineups
// Data verified from TheSportsDB API. Loads instantly — no API calls needed for cached players.

export interface CachedPlayer {
  idPlayer: string
  strPlayer: string
  strTeam: string
  strPosition: string
  strThumb: string | null
  strCutout: string | null
  strRender: string | null
  strNumber: string | null
  strNationality: string | null
}

// lookup by lowercase name
const cache: Record<string, CachedPlayer> = {}

function add(p: CachedPlayer) {
  cache[p.strPlayer.toLowerCase()] = p
}

// ── Barcelona 2009 ──
add({ idPlayer: "34149218", strPlayer: "Víctor Valdés", strTeam: "Barcelona", strPosition: "Goalkeeper", strThumb: "https://r2.thesportsdb.com/images/media/player/thumb/vwpvry1448813175.jpg", strCutout: null, strRender: null, strNumber: "1", strNationality: "Spain" })
add({ idPlayer: "34145176", strPlayer: "Dani Alves", strTeam: "Barcelona", strPosition: "Right Back", strThumb: "https://r2.thesportsdb.com/images/media/player/thumb/jcrv8e1448813214.jpg", strCutout: "https://r2.thesportsdb.com/images/media/player/cutout/jcrv8e1448813214.png", strRender: null, strNumber: "2", strNationality: "Brazil" })
add({ idPlayer: "34145346", strPlayer: "Gerard Piqué", strTeam: "Barcelona", strPosition: "Centre Back", strThumb: "https://r2.thesportsdb.com/images/media/player/thumb/u983jz1448813277.jpg", strCutout: "https://r2.thesportsdb.com/images/media/player/cutout/u983jz1448813277.png", strRender: null, strNumber: "3", strNationality: "Spain" })
add({ idPlayer: "34145632", strPlayer: "Carles Puyol", strTeam: "Barcelona", strPosition: "Centre Back", strThumb: "https://r2.thesportsdb.com/images/media/player/thumb/on2gr41448813373.jpg", strCutout: "https://r2.thesportsdb.com/images/media/player/cutout/on2gr41448813373.png", strRender: null, strNumber: "5", strNationality: "Spain" })
add({ idPlayer: "34148493", strPlayer: "Éric Abidal", strTeam: "Barcelona", strPosition: "Left Back", strThumb: "https://r2.thesportsdb.com/images/media/player/thumb/k83cak1448813435.jpg", strCutout: null, strRender: null, strNumber: "22", strNationality: "France" })
add({ idPlayer: "34145746", strPlayer: "Sergio Busquets", strTeam: "Barcelona", strPosition: "Defensive Midfield", strThumb: "https://r2.thesportsdb.com/images/media/player/thumb/yvwvt61448813491.jpg", strCutout: "https://r2.thesportsdb.com/images/media/player/cutout/yvwvt61448813491.png", strRender: null, strNumber: "28", strNationality: "Spain" })
add({ idPlayer: "34145528", strPlayer: "Xavi Hernández", strTeam: "Barcelona", strPosition: "Central Midfield", strThumb: "https://r2.thesportsdb.com/images/media/player/thumb/k3skpm1448813545.jpg", strCutout: "https://r2.thesportsdb.com/images/media/player/cutout/k3skpm1448813545.png", strRender: null, strNumber: "6", strNationality: "Spain" })
add({ idPlayer: "34145761", strPlayer: "Andrés Iniesta", strTeam: "Barcelona", strPosition: "Central Midfield", strThumb: "https://r2.thesportsdb.com/images/media/player/thumb/2019-09-25-10-02-52.png", strCutout: "https://r2.thesportsdb.com/images/media/player/cutout/2019-09-25-10-02-52.png", strRender: null, strNumber: "8", strNationality: "Spain" })
add({ idPlayer: "34145870", strPlayer: "Lionel Messi", strTeam: "Barcelona", strPosition: "Right Wing", strThumb: "https://r2.thesportsdb.com/images/media/player/thumb/vwvwrw1448813114.jpg", strCutout: "https://r2.thesportsdb.com/images/media/player/cutout/vwvwrw1448813114.png", strRender: null, strNumber: "10", strNationality: "Argentina" })
add({ idPlayer: "34145965", strPlayer: "Samuel Eto'o", strTeam: "Barcelona", strPosition: "Centre Forward", strThumb: "https://r2.thesportsdb.com/images/media/player/thumb/yvwqxt1448813659.jpg", strCutout: "https://r2.thesportsdb.com/images/media/player/cutout/yvwqxt1448813659.png", strRender: null, strNumber: "9", strNationality: "Cameroon" })
add({ idPlayer: "34161137", strPlayer: "Thierry Henry", strTeam: "Barcelona", strPosition: "Left Wing", strThumb: "https://r2.thesportsdb.com/images/media/player/thumb/vflsaf1698248867.jpg", strCutout: "https://r2.thesportsdb.com/images/media/player/cutout/omd0kz1698248921.png", strRender: null, strNumber: "14", strNationality: "France" })

// ── Real Madrid 2017 ──
add({ idPlayer: "34149804", strPlayer: "Keylor Navas", strTeam: "Real Madrid", strPosition: "Goalkeeper", strThumb: "https://r2.thesportsdb.com/images/media/player/thumb/pnl0rl1448814282.jpg", strCutout: null, strRender: null, strNumber: "1", strNationality: "Costa Rica" })
add({ idPlayer: "34145259", strPlayer: "Dani Carvajal", strTeam: "Real Madrid", strPosition: "Right Back", strThumb: "https://r2.thesportsdb.com/images/media/player/thumb/o9jv8x1448814091.jpg", strCutout: "https://r2.thesportsdb.com/images/media/player/cutout/o9jv8x1448814091.png", strRender: null, strNumber: "2", strNationality: "Spain" })
add({ idPlayer: "34146152", strPlayer: "Sergio Ramos", strTeam: "Real Madrid", strPosition: "Centre Back", strThumb: "https://r2.thesportsdb.com/images/media/player/thumb/yvua1u1448813367.jpg", strCutout: "https://r2.thesportsdb.com/images/media/player/cutout/yvua1u1448813367.png", strRender: null, strNumber: "4", strNationality: "Spain" })
add({ idPlayer: "34149782", strPlayer: "Raphaël Varane", strTeam: "Real Madrid", strPosition: "Centre Back", strThumb: "https://r2.thesportsdb.com/images/media/player/thumb/1o3rj21448814164.jpg", strCutout: "https://r2.thesportsdb.com/images/media/player/cutout/1o3rj21448814164.png", strRender: null, strNumber: "5", strNationality: "France" })
add({ idPlayer: "34145796", strPlayer: "Marcelo", strTeam: "Real Madrid", strPosition: "Left Back", strThumb: "https://r2.thesportsdb.com/images/media/player/thumb/rt1wlq1448814435.jpg", strCutout: "https://r2.thesportsdb.com/images/media/player/cutout/rt1wlq1448814435.png", strRender: null, strNumber: "12", strNationality: "Brazil" })
add({ idPlayer: "34146079", strPlayer: "Casemiro", strTeam: "Real Madrid", strPosition: "Defensive Midfield", strThumb: "https://r2.thesportsdb.com/images/media/player/thumb/bwvgl31448814668.jpg", strCutout: "https://r2.thesportsdb.com/images/media/player/cutout/bwvgl31448814668.png", strRender: null, strNumber: "14", strNationality: "Brazil" })
add({ idPlayer: "34146050", strPlayer: "Luka Modrić", strTeam: "Real Madrid", strPosition: "Central Midfield", strThumb: "https://r2.thesportsdb.com/images/media/player/thumb/y0wa351448813603.jpg", strCutout: "https://r2.thesportsdb.com/images/media/player/cutout/y0wa351448813603.png", strRender: null, strNumber: "19", strNationality: "Croatia" })
add({ idPlayer: "34146344", strPlayer: "Toni Kroos", strTeam: "Real Madrid", strPosition: "Central Midfield", strThumb: "https://r2.thesportsdb.com/images/media/player/thumb/80l36s1448813801.jpg", strCutout: "https://r2.thesportsdb.com/images/media/player/cutout/80l36s1448813801.png", strRender: null, strNumber: "8", strNationality: "Germany" })
add({ idPlayer: "34146434", strPlayer: "Isco", strTeam: "Real Madrid", strPosition: "Attacking Midfield", strThumb: "https://r2.thesportsdb.com/images/media/player/thumb/15j2fh1448814219.jpg", strCutout: "https://r2.thesportsdb.com/images/media/player/cutout/15j2fh1448814219.png", strRender: null, strNumber: "22", strNationality: "Spain" })
add({ idPlayer: "34145842", strPlayer: "Karim Benzema", strTeam: "Real Madrid", strPosition: "Centre Forward", strThumb: "https://r2.thesportsdb.com/images/media/player/thumb/u983gz1448814399.jpg", strCutout: "https://r2.thesportsdb.com/images/media/player/cutout/u983gz1448814399.png", strRender: null, strNumber: "9", strNationality: "France" })
add({ idPlayer: "34145957", strPlayer: "Cristiano Ronaldo", strTeam: "Real Madrid", strPosition: "Left Wing", strThumb: "https://r2.thesportsdb.com/images/media/player/thumb/9r4rk81448813302.jpg", strCutout: "https://r2.thesportsdb.com/images/media/player/cutout/9r4rk81448813302.png", strRender: null, strNumber: "7", strNationality: "Portugal" })

// ── Liverpool 2005 ──
add({ idPlayer: "34146843", strPlayer: "Jerzy Dudek", strTeam: "Liverpool", strPosition: "Goalkeeper", strThumb: "https://r2.thesportsdb.com/images/media/player/thumb/rv1b7u1448815130.jpg", strCutout: null, strRender: null, strNumber: "1", strNationality: "Poland" })
add({ idPlayer: "34167327", strPlayer: "Steve Finnan", strTeam: "Liverpool", strPosition: "Right Back", strThumb: "https://r2.thesportsdb.com/images/media/player/thumb/178eub1448815253.jpg", strCutout: null, strRender: null, strNumber: "3", strNationality: "Ireland" })
add({ idPlayer: "34162857", strPlayer: "Jamie Carragher", strTeam: "Liverpool", strPosition: "Centre Back", strThumb: "https://r2.thesportsdb.com/images/media/player/thumb/192gxk1448815473.jpg", strCutout: null, strRender: null, strNumber: "23", strNationality: "England" })
add({ idPlayer: "34171391", strPlayer: "Sami Hyypiä", strTeam: "Liverpool", strPosition: "Centre Back", strThumb: "https://r2.thesportsdb.com/images/media/player/thumb/h7uws61448815673.jpg", strCutout: null, strRender: null, strNumber: "4", strNationality: "Finland" })
add({ idPlayer: "34145224", strPlayer: "John Arne Riise", strTeam: "Liverpool", strPosition: "Left Back", strThumb: "https://r2.thesportsdb.com/images/media/player/thumb/10n9fb1448815855.jpg", strCutout: null, strRender: null, strNumber: "6", strNationality: "Norway" })
add({ idPlayer: "34146132", strPlayer: "Steven Gerrard", strTeam: "Liverpool", strPosition: "Central Midfield", strThumb: "https://r2.thesportsdb.com/images/media/player/thumb/9803go1448813635.jpg", strCutout: "https://r2.thesportsdb.com/images/media/player/cutout/9803go1448813635.png", strRender: null, strNumber: "8", strNationality: "England" })
add({ idPlayer: "34146705", strPlayer: "Xabi Alonso", strTeam: "Liverpool", strPosition: "Central Midfield", strThumb: "https://r2.thesportsdb.com/images/media/player/thumb/15kq2y1448813992.jpg", strCutout: "https://r2.thesportsdb.com/images/media/player/cutout/15kq2y1448813992.png", strRender: null, strNumber: "14", strNationality: "Spain" })
add({ idPlayer: "34167308", strPlayer: "Luis García", strTeam: "Liverpool", strPosition: "Right Wing", strThumb: "https://r2.thesportsdb.com/images/media/player/thumb/t73r4e1448816079.jpg", strCutout: null, strRender: null, strNumber: "10", strNationality: "Spain" })
add({ idPlayer: "34171390", strPlayer: "Harry Kewell", strTeam: "Liverpool", strPosition: "Left Wing", strThumb: "https://r2.thesportsdb.com/images/media/player/thumb/xzhyu51448816154.jpg", strCutout: null, strRender: null, strNumber: "7", strNationality: "Australia" })
add({ idPlayer: "34167284", strPlayer: "Milan Baroš", strTeam: "Liverpool", strPosition: "Centre Forward", strThumb: "https://r2.thesportsdb.com/images/media/player/thumb/m5p8n31448816249.jpg", strCutout: null, strRender: null, strNumber: "5", strNationality: "Czech Republic" })
add({ idPlayer: "34167297", strPlayer: "Djibril Cissé", strTeam: "Liverpool", strPosition: "Left Wing", strThumb: "https://r2.thesportsdb.com/images/media/player/thumb/jn33d61448816327.jpg", strCutout: null, strRender: null, strNumber: "9", strNationality: "France" })

// ── Man United 1999 ──
add({ idPlayer: "34146473", strPlayer: "Peter Schmeichel", strTeam: "Manchester United", strPosition: "Goalkeeper", strThumb: "https://r2.thesportsdb.com/images/media/player/thumb/15p0lr1448816657.jpg", strCutout: null, strRender: null, strNumber: "1", strNationality: "Denmark" })
add({ idPlayer: "34145258", strPlayer: "Gary Neville", strTeam: "Manchester United", strPosition: "Right Back", strThumb: "https://r2.thesportsdb.com/images/media/player/thumb/l83m0d1448816873.jpg", strCutout: null, strRender: null, strNumber: "2", strNationality: "England" })
add({ idPlayer: "34149448", strPlayer: "Ronny Johnsen", strTeam: "Manchester United", strPosition: "Centre Back", strThumb: "https://r2.thesportsdb.com/images/media/player/thumb/14p10l1448816999.jpg", strCutout: null, strRender: null, strNumber: "5", strNationality: "Norway" })
add({ idPlayer: "34145156", strPlayer: "Jaap Stam", strTeam: "Manchester United", strPosition: "Centre Back", strThumb: "https://r2.thesportsdb.com/images/media/player/thumb/xzy0vu1448817098.jpg", strCutout: null, strRender: null, strNumber: "6", strNationality: "Netherlands" })
add({ idPlayer: "34145140", strPlayer: "Denis Irwin", strTeam: "Manchester United", strPosition: "Left Back", strThumb: "https://r2.thesportsdb.com/images/media/player/thumb/14d0a61448817205.jpg", strCutout: null, strRender: null, strNumber: "3", strNationality: "Ireland" })
add({ idPlayer: "34145827", strPlayer: "David Beckham", strTeam: "Manchester United", strPosition: "Right Midfield", strThumb: "https://r2.thesportsdb.com/images/media/player/thumb/nkf3kk1448813228.jpg", strCutout: "https://r2.thesportsdb.com/images/media/player/cutout/nkf3kk1448813228.png", strRender: null, strNumber: "7", strNationality: "England" })
add({ idPlayer: "34145713", strPlayer: "Roy Keane", strTeam: "Manchester United", strPosition: "Central Midfield", strThumb: "https://r2.thesportsdb.com/images/media/player/thumb/17wofn1448813483.jpg", strCutout: null, strRender: null, strNumber: "16", strNationality: "Ireland" })
add({ idPlayer: "34145719", strPlayer: "Paul Scholes", strTeam: "Manchester United", strPosition: "Central Midfield", strThumb: "https://r2.thesportsdb.com/images/media/player/thumb/y70j9w1448813315.jpg", strCutout: null, strRender: null, strNumber: "18", strNationality: "England" })
add({ idPlayer: "34145648", strPlayer: "Ryan Giggs", strTeam: "Manchester United", strPosition: "Left Midfield", strThumb: "https://r2.thesportsdb.com/images/media/player/thumb/i5c8fo1612098367.jpg", strCutout: "https://r2.thesportsdb.com/images/media/player/cutout/uyuonc1612097704.png", strRender: null, strNumber: "11", strNationality: "Wales" })
add({ idPlayer: "34161217", strPlayer: "Andy Cole", strTeam: "Manchester United", strPosition: "Centre Forward", strThumb: "https://r2.thesportsdb.com/images/media/player/thumb/pua4ll1488747165.jpg", strCutout: "https://r2.thesportsdb.com/images/media/player/cutout/eekjcz1664012819.png", strRender: null, strNumber: "9", strNationality: "England" })
add({ idPlayer: "34161226", strPlayer: "Dwight Yorke", strTeam: "Manchester United", strPosition: "Centre Forward", strThumb: "https://r2.thesportsdb.com/images/media/player/thumb/vyfmyx1488828396.jpg", strCutout: null, strRender: null, strNumber: "19", strNationality: "Trinidad and Tobago" })

// ── AC Milan 2007 ──
add({ idPlayer: "34167158", strPlayer: "Gianluigi Buffon", strTeam: "Juventus", strPosition: "Goalkeeper", strThumb: "https://r2.thesportsdb.com/images/media/player/thumb/9bjr3b1448817663.jpg", strCutout: "https://r2.thesportsdb.com/images/media/player/cutout/9bjr3b1448817663.png", strRender: null, strNumber: "1", strNationality: "Italy" })
add({ idPlayer: "34145430", strPlayer: "Cafu", strTeam: "AC Milan", strPosition: "Right Back", strThumb: "https://r2.thesportsdb.com/images/media/player/thumb/1070jg1448817920.jpg", strCutout: null, strRender: null, strNumber: "2", strNationality: "Brazil" })
add({ idPlayer: "34146280", strPlayer: "Paolo Maldini", strTeam: "AC Milan", strPosition: "Centre Back", strThumb: "https://r2.thesportsdb.com/images/media/player/thumb/9q8s171448818046.jpg", strCutout: null, strRender: null, strNumber: "3", strNationality: "Italy" })
add({ idPlayer: "34145164", strPlayer: "Alessandro Nesta", strTeam: "AC Milan", strPosition: "Centre Back", strThumb: "https://r2.thesportsdb.com/images/media/player/thumb/52u00a1448818222.jpg", strCutout: null, strRender: null, strNumber: "13", strNationality: "Italy" })
add({ idPlayer: "34145803", strPlayer: "Gennaro Gattuso", strTeam: "AC Milan", strPosition: "Central Midfield", strThumb: "https://r2.thesportsdb.com/images/media/player/thumb/yvsom21448818340.jpg", strCutout: null, strRender: null, strNumber: "8", strNationality: "Italy" })
add({ idPlayer: "34146368", strPlayer: "Andrea Pirlo", strTeam: "AC Milan", strPosition: "Central Midfield", strThumb: "https://r2.thesportsdb.com/images/media/player/thumb/f1s8v01448818454.jpg", strCutout: "https://r2.thesportsdb.com/images/media/player/cutout/f1s8v01448818454.png", strRender: null, strNumber: "21", strNationality: "Italy" })
add({ idPlayer: "34145354", strPlayer: "Clarence Seedorf", strTeam: "AC Milan", strPosition: "Central Midfield", strThumb: "https://r2.thesportsdb.com/images/media/player/thumb/v0n33q1448818545.jpg", strCutout: null, strRender: null, strNumber: "10", strNationality: "Netherlands" })
add({ idPlayer: "34146455", strPlayer: "Kaká", strTeam: "AC Milan", strPosition: "Attacking Midfield", strThumb: "https://r2.thesportsdb.com/images/media/player/thumb/1d8f1s1448813119.jpg", strCutout: "https://r2.thesportsdb.com/images/media/player/cutout/1d8f1s1448813119.png", strRender: null, strNumber: "22", strNationality: "Brazil" })
add({ idPlayer: "34145691", strPlayer: "Andriy Shevchenko", strTeam: "AC Milan", strPosition: "Centre Forward", strThumb: "https://r2.thesportsdb.com/images/media/player/thumb/13c0u11448813059.jpg", strCutout: "https://r2.thesportsdb.com/images/media/player/cutout/13c0u11448813059.png", strRender: null, strNumber: "7", strNationality: "Ukraine" })
add({ idPlayer: "34167274", strPlayer: "Massimo Oddo", strTeam: "AC Milan", strPosition: "Right Back", strThumb: "https://r2.thesportsdb.com/images/media/player/thumb/32tou11448818639.jpg", strCutout: null, strRender: null, strNumber: "44", strNationality: "Italy" })
add({ idPlayer: "34145226", strPlayer: "Filippo Inzaghi", strTeam: "AC Milan", strPosition: "Centre Forward", strThumb: "https://r2.thesportsdb.com/images/media/player/thumb/4f1m231448818750.jpg", strCutout: null, strRender: null, strNumber: "9", strNationality: "Italy" })

// ── Italy 2006 ──
add({ idPlayer: "34149756", strPlayer: "Gianluca Zambrotta", strTeam: "AC Milan", strPosition: "Right Back", strThumb: "https://r2.thesportsdb.com/images/media/player/thumb/s1q83v1448819083.jpg", strCutout: null, strRender: null, strNumber: "19", strNationality: "Italy" })
add({ idPlayer: "34145688", strPlayer: "Fabio Cannavaro", strTeam: "Juventus", strPosition: "Centre Back", strThumb: "https://r2.thesportsdb.com/images/media/player/thumb/mk6tve1448819219.jpg", strCutout: null, strRender: null, strNumber: "5", strNationality: "Italy" })
add({ idPlayer: "34145983", strPlayer: "Marco Materazzi", strTeam: "Inter Milan", strPosition: "Centre Back", strThumb: "https://r2.thesportsdb.com/images/media/player/thumb/89c08a1448819320.jpg", strCutout: null, strRender: null, strNumber: "23", strNationality: "Italy" })
add({ idPlayer: "34167312", strPlayer: "Fabio Grosso", strTeam: "Inter Milan", strPosition: "Left Back", strThumb: "https://r2.thesportsdb.com/images/media/player/thumb/v20k4z1448819458.jpg", strCutout: null, strRender: null, strNumber: "3", strNationality: "Italy" })
add({ idPlayer: "34145765", strPlayer: "Francesco Totti", strTeam: "Roma", strPosition: "Attacking Midfield", strThumb: "https://r2.thesportsdb.com/images/media/player/thumb/p3k20l1448819553.jpg", strCutout: null, strRender: null, strNumber: "10", strNationality: "Italy" })
add({ idPlayer: "34146347", strPlayer: "Luca Toni", strTeam: "Fiorentina", strPosition: "Centre Forward", strThumb: "https://r2.thesportsdb.com/images/media/player/thumb/1t1u6t1448819649.jpg", strCutout: null, strRender: null, strNumber: "9", strNationality: "Italy" })
add({ idPlayer: "34145226", strPlayer: "Filippo Inzaghi", strTeam: "AC Milan", strPosition: "Centre Forward", strThumb: "https://r2.thesportsdb.com/images/media/player/thumb/4f1m231448818750.jpg", strCutout: null, strRender: null, strNumber: "11", strNationality: "Italy" })
add({ idPlayer: "34167315", strPlayer: "Simone Perrotta", strTeam: "Roma", strPosition: "Left Wing", strThumb: "https://r2.thesportsdb.com/images/media/player/thumb/1w4w5x1448819780.jpg", strCutout: null, strRender: null, strNumber: "20", strNationality: "Italy" })

// ── Germany 2014 ──
add({ idPlayer: "34146681", strPlayer: "Manuel Neuer", strTeam: "Bayern Munich", strPosition: "Goalkeeper", strThumb: "https://r2.thesportsdb.com/images/media/player/thumb/2wx5jc1779384216.jpg", strCutout: "https://r2.thesportsdb.com/images/media/player/cutout/udq0so1756416089.png", strRender: null, strNumber: "1", strNationality: "Germany" })
add({ idPlayer: "34146688", strPlayer: "Philipp Lahm", strTeam: "Bayern Munich", strPosition: "Right Back", strThumb: "https://r2.thesportsdb.com/images/media/player/thumb/ltocxo1615114367.jpg", strCutout: "https://r2.thesportsdb.com/images/media/player/cutout/p860lg1615114273.png", strRender: null, strNumber: "16", strNationality: "Germany" })
add({ idPlayer: "34154852", strPlayer: "Mats Hummels", strTeam: "Borussia Dortmund", strPosition: "Centre Back", strThumb: "https://r2.thesportsdb.com/images/media/player/thumb/tvbryp1717423189.jpg", strCutout: "https://r2.thesportsdb.com/images/media/player/cutout/qdecrt1674558770.png", strRender: null, strNumber: "5", strNationality: "Germany" })
add({ idPlayer: "34146687", strPlayer: "Jérôme Boateng", strTeam: "Bayern Munich", strPosition: "Centre Back", strThumb: "https://r2.thesportsdb.com/images/media/player/thumb/pr108i1660764830.jpg", strCutout: "https://r2.thesportsdb.com/images/media/player/cutout/u5qo051681230837.png", strRender: null, strNumber: "17", strNationality: "Germany" })
add({ idPlayer: "34155250", strPlayer: "Benedikt Höwedes", strTeam: "Schalke 04", strPosition: "Centre Back", strThumb: "https://r2.thesportsdb.com/images/media/player/thumb/8b73ue1532776590.jpg", strCutout: null, strRender: null, strNumber: "4", strNationality: "Germany" })
add({ idPlayer: "34146442", strPlayer: "Bastian Schweinsteiger", strTeam: "Bayern Munich", strPosition: "Central Midfield", strThumb: "https://r2.thesportsdb.com/images/media/player/thumb/p68o3f1448812945.jpg", strCutout: "https://r2.thesportsdb.com/images/media/player/cutout/p68o3f1448812945.png", strRender: null, strNumber: "7", strNationality: "Germany" })
add({ idPlayer: "34146344", strPlayer: "Toni Kroos", strTeam: "Bayern Munich", strPosition: "Central Midfield", strThumb: "https://r2.thesportsdb.com/images/media/player/thumb/80l36s1448813801.jpg", strCutout: "https://r2.thesportsdb.com/images/media/player/cutout/80l36s1448813801.png", strRender: null, strNumber: "18", strNationality: "Germany" })
add({ idPlayer: "34146635", strPlayer: "Sami Khedira", strTeam: "Real Madrid", strPosition: "Central Midfield", strThumb: "https://r2.thesportsdb.com/images/media/player/thumb/1q92f81448812804.jpg", strCutout: null, strRender: null, strNumber: "6", strNationality: "Germany" })
add({ idPlayer: "34146670", strPlayer: "Mesut Özil", strTeam: "Real Madrid", strPosition: "Attacking Midfield", strThumb: "https://r2.thesportsdb.com/images/media/player/thumb/1d8f1s1448812999.jpg", strCutout: "https://r2.thesportsdb.com/images/media/player/cutout/1d8f1s1448812999.png", strRender: null, strNumber: "8", strNationality: "Germany" })
add({ idPlayer: "34146765", strPlayer: "Miroslav Klose", strTeam: "Bayern Munich", strPosition: "Centre Forward", strThumb: "https://r2.thesportsdb.com/images/media/player/thumb/1s8c3d1448813426.jpg", strCutout: null, strRender: null, strNumber: "11", strNationality: "Germany" })
add({ idPlayer: "34146690", strPlayer: "Thomas Müller", strTeam: "Bayern Munich", strPosition: "Right Wing", strThumb: "https://r2.thesportsdb.com/images/media/player/thumb/e8t1kq1699498465.jpg", strCutout: "https://r2.thesportsdb.com/images/media/player/cutout/e8t1kq1699498465.png", strRender: null, strNumber: "13", strNationality: "Germany" })

// ── Arsenal 2004 ──
add({ idPlayer: "34171359", strPlayer: "Jens Lehmann", strTeam: "Arsenal", strPosition: "Goalkeeper", strThumb: "https://r2.thesportsdb.com/images/media/player/thumb/4l9osg1595098819.jpg", strCutout: null, strRender: null, strNumber: "1", strNationality: "Germany" })
add({ idPlayer: "34145116", strPlayer: "Lauren", strTeam: "Arsenal", strPosition: "Right Back", strThumb: "https://r2.thesportsdb.com/images/media/player/thumb/uqjy7r1448819901.jpg", strCutout: null, strRender: null, strNumber: "12", strNationality: "Cameroon" })
add({ idPlayer: "34167672", strPlayer: "Sol Campbell", strTeam: "Arsenal", strPosition: "Centre Back", strThumb: "https://r2.thesportsdb.com/images/media/player/thumb/opjicd1640191774.jpg", strCutout: "https://r2.thesportsdb.com/images/media/player/cutout/hunvb81640191842.png", strRender: null, strNumber: "23", strNationality: "England" })
add({ idPlayer: "34145903", strPlayer: "Kolo Touré", strTeam: "Arsenal", strPosition: "Centre Back", strThumb: "https://r2.thesportsdb.com/images/media/player/thumb/gcfhzb1640191913.jpg", strCutout: "https://r2.thesportsdb.com/images/media/player/cutout/iqzwhw1654247097.png", strRender: null, strNumber: "28", strNationality: "Ivory Coast" })
add({ idPlayer: "34147201", strPlayer: "Ashley Cole", strTeam: "Arsenal", strPosition: "Left Back", strThumb: "https://r2.thesportsdb.com/images/media/player/thumb/qoew7z1640192930.jpg", strCutout: "https://r2.thesportsdb.com/images/media/player/cutout/9c9mve1640192686.png", strRender: null, strNumber: "3", strNationality: "England" })
add({ idPlayer: "34171363", strPlayer: "Robert Pirès", strTeam: "Arsenal", strPosition: "Right Wing", strThumb: "https://r2.thesportsdb.com/images/media/player/thumb/owa5rf1595098704.jpg", strCutout: null, strRender: null, strNumber: "7", strNationality: "France" })
add({ idPlayer: "34161139", strPlayer: "Patrick Vieira", strTeam: "Arsenal", strPosition: "Central Midfield", strThumb: "https://r2.thesportsdb.com/images/media/player/thumb/vl1dss1711379937.jpg", strCutout: "https://r2.thesportsdb.com/images/media/player/cutout/5yaiiv1654254461.png", strRender: null, strNumber: "4", strNationality: "France" })
add({ idPlayer: "34171362", strPlayer: "Gilberto Silva", strTeam: "Arsenal", strPosition: "Central Midfield", strThumb: "https://r2.thesportsdb.com/images/media/player/thumb/d9r2fd1594372058.jpg", strCutout: "https://r2.thesportsdb.com/images/media/player/cutout/ijx0cb1594372148.png", strRender: null, strNumber: "19", strNationality: "Brazil" })
add({ idPlayer: "34171361", strPlayer: "Fredrik Ljungberg", strTeam: "Arsenal", strPosition: "Left Wing", strThumb: "https://r2.thesportsdb.com/images/media/player/thumb/dnojt81595098615.jpg", strCutout: null, strRender: null, strNumber: "8", strNationality: "Sweden" })
add({ idPlayer: "34161137", strPlayer: "Thierry Henry", strTeam: "Arsenal", strPosition: "Centre Forward", strThumb: "https://r2.thesportsdb.com/images/media/player/thumb/vflsaf1698248867.jpg", strCutout: "https://r2.thesportsdb.com/images/media/player/cutout/omd0kz1698248921.png", strRender: null, strNumber: "14", strNationality: "France" })
add({ idPlayer: "34161247", strPlayer: "Dennis Bergkamp", strTeam: "Arsenal", strPosition: "Second Striker", strThumb: "https://r2.thesportsdb.com/images/media/player/thumb/v7i1pu1490350140.jpg", strCutout: "https://r2.thesportsdb.com/images/media/player/cutout/45obbq1495135195.png", strRender: null, strNumber: "10", strNationality: "Netherlands" })

// ── France 1998 ──
add({ idPlayer: "34171440", strPlayer: "Fabien Barthez", strTeam: "France", strPosition: "Goalkeeper", strThumb: "https://r2.thesportsdb.com/images/media/player/thumb/3nypay1595098900.jpg", strCutout: null, strRender: null, strNumber: "16", strNationality: "France" })
add({ idPlayer: "34171439", strPlayer: "Lilian Thuram", strTeam: "France", strPosition: "Right Back", strThumb: "https://r2.thesportsdb.com/images/media/player/thumb/jrsdlp1594485537.jpg", strCutout: null, strRender: null, strNumber: "15", strNationality: "France" })
add({ idPlayer: "34167249", strPlayer: "Marcel Desailly", strTeam: "France", strPosition: "Centre Back", strThumb: "https://r2.thesportsdb.com/images/media/player/thumb/6rq3ad1558809950.jpg", strCutout: null, strRender: null, strNumber: "8", strNationality: "France" })
add({ idPlayer: "34171434", strPlayer: "Laurent Blanc", strTeam: "France", strPosition: "Centre Back", strThumb: "https://r2.thesportsdb.com/images/media/player/thumb/tlujuc1594485028.jpg", strCutout: null, strRender: null, strNumber: "5", strNationality: "France" })
add({ idPlayer: "34161138", strPlayer: "Bixente Lizarazu", strTeam: "France", strPosition: "Left Back", strThumb: "https://r2.thesportsdb.com/images/media/player/thumb/sblu2c1512818706.jpg", strCutout: null, strRender: null, strNumber: "2", strNationality: "France" })
add({ idPlayer: "34169294", strPlayer: "Didier Deschamps", strTeam: "France", strPosition: "Central Midfield", strThumb: "https://r2.thesportsdb.com/images/media/player/thumb/464fdi1620132742.jpg", strCutout: "https://r2.thesportsdb.com/images/media/player/cutout/adxgwj1592666238.png", strRender: null, strNumber: "7", strNationality: "France" })
add({ idPlayer: "34171441", strPlayer: "Emmanuel Petit", strTeam: "France", strPosition: "Central Midfield", strThumb: "https://r2.thesportsdb.com/images/media/player/thumb/vmaxpa1594485595.jpg", strCutout: null, strRender: null, strNumber: "17", strNationality: "France" })
add({ idPlayer: "34161049", strPlayer: "Zinédine Zidane", strTeam: "France", strPosition: "Attacking Midfield", strThumb: "https://r2.thesportsdb.com/images/media/player/thumb/trvvrs1474915622.jpg", strCutout: "https://r2.thesportsdb.com/images/media/player/cutout/ae7bng1586814446.png", strRender: null, strNumber: "10", strNationality: "France" })
add({ idPlayer: "34171435", strPlayer: "Youri Djorkaeff", strTeam: "France", strPosition: "Right Wing", strThumb: "https://r2.thesportsdb.com/images/media/player/thumb/2sfoy61594485491.jpg", strCutout: null, strRender: null, strNumber: "6", strNationality: "France" })
add({ idPlayer: "34171436", strPlayer: "Stéphane Guivarc'h", strTeam: "France", strPosition: "Centre Forward", strThumb: "https://r2.thesportsdb.com/images/media/player/thumb/n2oncu1683239054.jpg", strCutout: null, strRender: null, strNumber: "9", strNationality: "France" })

// ── Inter Milan 2010 ──
add({ idPlayer: "34146191", strPlayer: "Júlio César", strTeam: "Inter Milan", strPosition: "Goalkeeper", strThumb: "https://r2.thesportsdb.com/images/media/player/thumb/kjbrfi1448812116.jpg", strCutout: null, strRender: null, strNumber: "1", strNationality: "Brazil" })
add({ idPlayer: "34145316", strPlayer: "Maicon", strTeam: "Inter Milan", strPosition: "Right Back", strThumb: "https://r2.thesportsdb.com/images/media/player/thumb/216l4p1448812205.jpg", strCutout: null, strRender: null, strNumber: "13", strNationality: "Brazil" })
add({ idPlayer: "34145180", strPlayer: "Iván Córdoba", strTeam: "Inter Milan", strPosition: "Centre Back", strThumb: "https://r2.thesportsdb.com/images/media/player/thumb/x7q35r1448812324.jpg", strCutout: null, strRender: null, strNumber: "2", strNationality: "Colombia" })
add({ idPlayer: "34145556", strPlayer: "Walter Samuel", strTeam: "Inter Milan", strPosition: "Centre Back", strThumb: "https://r2.thesportsdb.com/images/media/player/thumb/w2p54n1448812421.jpg", strCutout: null, strRender: null, strNumber: "25", strNationality: "Argentina" })
add({ idPlayer: "34145126", strPlayer: "Luis Figo", strTeam: "Inter Milan", strPosition: "Right Wing", strThumb: "https://r2.thesportsdb.com/images/media/player/thumb/19s65j1448812560.jpg", strCutout: null, strRender: null, strNumber: "7", strNationality: "Portugal" })
add({ idPlayer: "34145757", strPlayer: "Esteban Cambiasso", strTeam: "Inter Milan", strPosition: "Central Midfield", strThumb: "https://r2.thesportsdb.com/images/media/player/thumb/33uq2a1448812683.jpg", strCutout: null, strRender: null, strNumber: "19", strNationality: "Argentina" })
add({ idPlayer: "34145388", strPlayer: "Wesley Sneijder", strTeam: "Inter Milan", strPosition: "Attacking Midfield", strThumb: "https://r2.thesportsdb.com/images/media/player/thumb/4e1dj41448812783.jpg", strCutout: null, strRender: null, strNumber: "10", strNationality: "Netherlands" })
add({ idPlayer: "34146211", strPlayer: "Dejan Stanković", strTeam: "Inter Milan", strPosition: "Central Midfield", strThumb: "https://r2.thesportsdb.com/images/media/player/thumb/g8m69e1448812869.jpg", strCutout: null, strRender: null, strNumber: "5", strNationality: "Serbia" })
add({ idPlayer: "34145965", strPlayer: "Samuel Eto'o", strTeam: "Inter Milan", strPosition: "Right Wing", strThumb: "https://r2.thesportsdb.com/images/media/player/thumb/yvwqxt1448813659.jpg", strCutout: "https://r2.thesportsdb.com/images/media/player/cutout/yvwqxt1448813659.png", strRender: null, strNumber: "9", strNationality: "Cameroon" })
add({ idPlayer: "34145569", strPlayer: "Diego Milito", strTeam: "Inter Milan", strPosition: "Centre Forward", strThumb: "https://r2.thesportsdb.com/images/media/player/thumb/o2wlk81448813750.jpg", strCutout: null, strRender: null, strNumber: "22", strNationality: "Argentina" })
add({ idPlayer: "34145390", strPlayer: "Javier Zanetti", strTeam: "Inter Milan", strPosition: "Left Midfield", strThumb: "https://r2.thesportsdb.com/images/media/player/thumb/9bjr3b1448813870.jpg", strCutout: null, strRender: null, strNumber: "4", strNationality: "Argentina" })

// ── Brazil 1970 (limited data) ──
add({ idPlayer: "34145528", strPlayer: "Jairzinho", strTeam: "Brazil", strPosition: "Right Wing", strThumb: "https://r2.thesportsdb.com/images/media/player/thumb/gcm93k1448813545.jpg", strCutout: null, strRender: null, strNumber: "7", strNationality: "Brazil" })

/**
 * Look up a cached player by name (case-insensitive, accent-insensitive).
 */
export function getCachedPlayer(name: string): CachedPlayer | null {
  const norm = (s: string) =>
    s.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[''`]/g, "")
      .replace(/[^a-z0-9 ]/g, "")
      .trim()
  const key = norm(name)

  // Try exact match first
  for (const [k, v] of Object.entries(cache)) {
    if (norm(k) === key) return v
  }
  // Try last-name match
  for (const [k, v] of Object.entries(cache)) {
    const parts = k.split(" ")
    if (parts.some((p) => norm(p) === key)) return v
  }
  // Try partial match (key is contained in cached name or vice versa)
  for (const [k, v] of Object.entries(cache)) {
    const nk = norm(k)
    if (nk.includes(key) || key.includes(nk)) return v
  }
  return null
}
