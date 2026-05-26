import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import * as Tone from "tone"

// ─────────────────────────────────────────────────────────────
// WORD DATABASE
// ─────────────────────────────────────────────────────────────
const WORDS = {
  easy: ["the","and","for","are","but","not","you","all","can","her","was","one","our","out","day","had","him","his","how","man","new","now","old","see","two","way","who","boy","did","get","has","let","put","say","she","too","use","cat","dog","run","big","fly","hot","ice","joy","key","map","nap","oak","pie","sea","sun","tap","win","zip","act","bay","cup","dip","egg","gap","hug","ink","jam","kit","lid","mop","net","owl","pan","pop","rag","sit","tub","van","wax","bed","car","ear","fan","hat","job","lab","mud","nod","pad","row","sad","tan","tug","wet","bit","bun","bus","buy","cab","den","dot","dry","elm","eve","far","fed","fit","fog","fox","fur","gem","gin","hay","hip","hop","hub","hum","hut","jaw","jig","kid","lap","lip","log","lot","mad","mat","mob","mom","mow","mug","nag","nip","nun","nut","odd","off","oil","paw","pea","peg","pen","pet","pig","pin","pod","pro","pub","pun","pup","ram","ran","rap","rat","raw","ray","rib","rid","rim","rip","rob","rod","rot","rum","rut","rye","sag","sap","sew","shy","sin","sip","sir","ski","sky","sly","sob","sow","soy","spa","spy","sub","tab","tar","tea","tie","tin","tip","toe","ton","top","toy","try","vat","vet","wad","war","web","wig","wit","woe","won","yam","yew","zap","ago","aid","aim","air","awe","axe","foe","fun","gal","ham","hem","hen","icy","ill","imp","inn","ion","ire","jot","jut","keep","lamb","lamp","lane","last","late","life","lift","like","lime","line","lion","live","lock","long","look","love","luck","lace","kind","make","male","many","mean","meat","meet","more","move","much","name","nice","nine","none","note","okay","only","open","pace","page","paid","pain","pale","park","past","path","peak","pick","pile","pine","pink","pipe","play","plot","plum","plus","poem","pole","pool","port","pose","post","pour","prey","pull","pump","pure","push","quit","race","rail","rain","rake","rang","rank","rate","real","reed","rely","rent","rice","rich","ride","ring","rise","risk","road","rock","role","roll","roof","room","rope","rose","ruin","rule","rush","safe","sail","sake","sale","salt","same","sand","save","scan","seal","seam","seat","seed","seek","self","send","shed","ship","shoe","shop","show","sigh","sign","silk","sing","sink","size","skin","skip","slam","slap","slip","slow","snow","soap","sock","soft","sold","sole","song","soul","soup","span","spit","spot","star","stay","stem","step","stop","such","suit","tale","tall","tame","tank","tape","team","tear","tell","test","text","than","that","them","then","they","thin","this","time","tire","told","toll","tone","took","tool","tore","torn","toss","tour","town","tree","trek","trio","trip","trot","true","tube","tune","turn","unit","upon","used","user","veil","very","view","vine","wade","wage","wake","walk","wall","ward","warm","warn","wash","wave","weak","weld","went","were","what","when","wide","wife","wild","will","wind","wine","wing","wire","wise","wolf","wood","word","wore","worm","worn","wrap","yard","year","yell","your","zone"],
  normal: ["about","above","abuse","actor","adult","after","again","agent","agree","ahead","alarm","album","alert","alike","alley","allow","alone","along","alter","angel","angle","angry","ankle","apart","apply","arena","argue","arise","armor","aside","asset","basic","batch","beach","began","begin","being","below","bench","blade","blank","blast","blend","bless","blind","block","bloom","board","bonus","boost","brace","brain","brand","brave","break","breed","brick","bride","brief","bring","broad","broke","brown","brush","build","bunch","buyer","cable","candy","carry","catch","cause","chain","chair","chalk","cheap","check","cheek","chest","chief","child","chill","chunk","claim","clash","class","clean","clear","clock","clone","close","cloth","cloud","coach","color","count","cover","craft","crack","crane","crash","cream","crime","cross","crowd","crown","crush","cycle","dance","dense","depth","dirty","dodge","doubt","draft","drain","drama","dress","drift","drink","drive","drown","eagle","earth","eight","email","empty","enter","equal","error","essay","event","every","exact","exist","extra","faint","faith","fancy","fatal","fever","fiber","field","fifth","fifty","fight","final","fixed","flame","flash","fleet","flesh","float","flood","floor","flour","flute","focus","force","forge","forum","frame","fraud","fresh","front","fruit","genre","ghost","giant","given","grace","grain","grand","grant","graph","grasp","great","green","greet","grief","grill","grind","groan","gross","group","grove","guard","guess","guest","guide","guilt","habit","happy","harsh","haven","heart","heavy","hedge","honor","horse","hotel","house","human","humor","hurry","image","imply","inbox","index","inner","input","issue","jewel","judge","juice","jumpy","knife","knock","known","label","large","laser","laugh","layer","learn","least","leave","legal","level","light","limit","liver","local","lodge","logic","loose","lover","lower","lucky","lyric","magic","major","maker","manor","maple","march","match","mayor","media","mercy","metal","might","model","money","month","moral","motor","mouse","mouth","movie","music","night","noble","noise","north","novel","nurse","occur","ocean","offer","often","owner","paint","panel","paper","party","peace","penny","pilot","place","plain","plane","plant","plate","plaza","poker","power","press","price","pride","prime","print","prize","probe","proud","prove","queen","query","quest","quick","quiet","quite","radio","raise","rally","ranch","range","rapid","ratio","reach","ready","reign","relax","renew","reply","reset","ridge","right","risen","risks","river","robot","rocky","roots","rover","royal","rugby","ruler","saint","salad","sauce","scale","scene","scope","score","scout","seals","sense","seven","shade","shaft","shake","shame","shape","share","shark","sharp","sheep","shelf","shell","shift","shine","shirt","shock","shoes","shore","short","shown","siege","signs","silly","since","sixth","sized","skate","skill","skirt","skull","slate","sleep","slope","small","smart","smell","smile","smoke","snake","solar","solid","solve","sorry","sound","spare","spark","speak","speed","spell","spend","spice","spoke","sport","spray","staff","stage","stain","stamp","stand","stark","stars","state","steak","steam","steel","steep","stick","still","sting","stock","stone","store","storm","story","strap","straw","strip","stuff","stunt","style","sugar","suite","surge","swamp","swear","sweat","sweep","sweet","swing","sword","table","taken","teach","teens","teeth","tempo","tenth","terms","tests","thank","theft","theme","thick","thing","think","three","throw","thumb","tiger","tight","token","tools","tooth","topic","torch","total","touch","tours","tower","towns","trace","track","trade","trail","train","trash","tread","treat","trend","trial","tribe","trick","tried","troop","truck","trust","truth","tutor","twice","twist","types","uncle","under","union","unite","units","until","upper","upset","value","vapor","vault","veins","venue","verse","views","viral","virus","visit","vital","vocal","voice","voted","voter","waist","walks","walls","waste","watch","water","waves","weary","weave","wedge","weigh","weird","wheat","wheel","where","which","while","white","whole","whose","wider","widow","width","winds","wines","wings","witch","wives","women","woods","works","world","worry","worse","worst","worth","wound","woven","wreck","wrist","write","wrong","wrote","yacht","yards","years","yield","young","yours","youth","zebra","zones"],
  hard: ["abandon","ability","absence","academy","acclaim","account","accuse","achieve","acquire","address","advance","adverse","advised","against","airline","airport","alcohol","alleged","already","analyst","analyze","another","anxiety","anxious","anybody","anymore","applied","arrange","arrival","article","assault","attempt","attract","auction","average","balance","banking","barrier","battery","becomes","believe","belongs","benefit","between","biggest","billion","binding","brought","burning","cabinet","calling","capable","capital","captain","capture","careful","carrier","catalog","ceiling","central","century","certain","chamber","channel","chapter","charity","checked","chronic","circuit","citizen","clearly","climate","closing","clothes","collect","college","combine","comfort","command","comment","company","compare","compete","complex","concept","concern","conduct","confirm","connect","consent","consist","consult","contact","contain","content","contest","context","control","correct","corrupt","cottage","council","counter","country","courage","created","crucial","crystal","culture","current","dealing","decided","declare","decline","default","defense","deficit","deliver","develop","devoted","diamond","digital","disease","display","dispute","distant","diverse","divided","divorce","dollars","drawing","dressed","drivers","driving","dropped","dynamic","earlier","eastern","economy","edition","educate","effects","efforts","elderly","elected","element","emerged","emotion","enables","enemies","engaged","engines","escaped","exactly","examine","excited","expense","explain","explore","express","failure","fashion","feature","federal","feeling","fiction","finance","finding","fitness","foreign","forever","formula","fortune","forward","freedom","gallery","general","getting","growing","handled","healthy","hearing","heavily","helping","herself","history","holiday","housing","hundred","husband","illegal","illness","imagine","improve","include","injured","inspire","instead","intense","joining","journal","journey","justice","landing","lasting","leading","learned","leisure","letters","liberty","library","license","limited","located","machine","managed","manager","married","massive","matters","maximum","measure","medical","meeting","mention","message","methods","million","minimum","missing","mission","mistake","mixture","monitor","morning","mounted","nations","natural","neither","network","nothing","noticed","nuclear","observe","obvious","offense","officer","ongoing","opening","operate","opinion","outcome","outline","outside","overall","parking","partial","partner","passage","passion","patient","pattern","payment","perfect","perform","perhaps","personal","planned","plastic","players","popular","portion","poverty","predict","prepare","present","prevent","primary","process","produce","product","profile","program","project","promise","protect","provide","publish","purpose","quality","quarter","quickly","raising","reached","reading","reality","realize","receive","recover","reduced","reflect","reform","related","release","remain","replace","request","require","reserve","respect","respond","restore","retired","revenue","reviews","routine","running","saving","scared","science","season","section","secure","select","serious","service","session","several","shadow","shortly","showing","silence","similar","society","software","solution","someone","special","species","spending","sponsor","spring","stable","status","strange","student","studied","subject","success","suggest","summary","supply","support","suppose","surface","surgery","suspect","tactics","talking","teacher","tension","terrible","testing","theater","therapy","thought","together","tonight","toward","traffic","tragedy","trained","transfer","travel","treated","tribute","typical","undergo","unhappy","village","violence","virtual","visitor","waiting","walking","weather","welcome","western","whenever","willing","winner","witness","wonder","working","worried","writing","written","yesterday"],
  expert: ["abbreviation","acceleration","accomplishment","accountability","accumulation","acknowledgment","administration","advertisement","affirmation","algorithmic","amelioration","amplification","approximation","argumentation","authentication","authorization","autobiography","biodiversity","bureaucratic","catastrophically","characterization","circumnavigation","circumstantial","classification","collaboration","commemoration","communication","comprehensive","concentration","configuration","confrontational","consciousness","consideration","consolidation","constitutional","contradiction","controversial","conventional","coordination","crystallization","decentralization","demonstration","determination","differentiation","discrimination","documentation","electromagnetic","entrepreneurial","environmental","equilibrium","establishment","exaggeration","examination","extrapolation","extraordinary","facilitation","fundamentalism","generalization","globalization","hallucination","hydroelectric","hypothetical","identification","illumination","implementation","impersonation","incomprehensible","individualization","initialization","instrumentation","interpretation","investigation","liberalization","manifestation","manipulation","materialization","metropolitan","miscommunication","modernization","multiplication","naturalization","normalization","objectification","optimization","orchestration","parameterization","participation","perseverance","pharmaceutical","philosophical","photosynthesis","popularization","precipitation","prioritization","privatization","proclamation","professionalism","psychological","quantification","rationalization","reconstruction","reinforcement","representation","reverberation","revitalization","revolutionary","satisfaction","simplification","socialization","sophisticated","specialization","standardization","substantiation","symbolization","systematization","technological","telecommunication","transformation","transportation","understanding","unification","visualization","vulnerability","customization","decomposition","differential","exceptionalism","gravitational","hypothetically","incompatibility","individualism","infrastructure","intervention","jurisdiction","manufacturing","minimization","misrepresentation","multidimensional","nationalization","nevertheless","observational","organizational","polarization","rationalization","rehabilitation","simultaneously","sophistication","stabilization","supernatural","sustainability","telecommunications","unquestionably"]
}

const SENTENCES = {
  easy: [
    "the dog ran fast down the old hill","she sat by the sea and smiled wide","we went to the store for some fresh milk","the cat sat on the warm mat by the door","he rode his red bike to the park","the sun set low and the sky turned pink","i like to read books and drink hot tea","the kids played in the yard all day long","my mom made soup in the big pot for us","the rain fell soft on the old roof all night","she found a lost dog and took it back home","he baked fresh bread and the whole house smelled great","the bird sang a sweet song from the tall oak tree","my dad and i went for a long hike in the woods","the sky was blue and the cool air felt so good","she wore a long red coat and a wide hat today","we made a fort from old bed sheets in the yard","we ate cake and sang songs at the big party last night","the snow fell and the whole quiet town turned white","the boy ran fast and won the race by a mile","we ate fish and chips by the old stone pier","she grew red roses in her small back yard this spring","the old clock on the wall chimed each and every hour","the fish swam deep in the cool dark sea below","the duck swam in the pond and the kids threw it bread","he drew a big fish and gave the painting to his mom","we flew kites on the hill on that bright and windy day","the post came late with a gift from my dear aunt","i put on my coat and went for a long walk alone","the bus was late but we still got there just on time"
  ],
  normal: [
    "she walked slowly through the garden admiring every blooming flower","we decided to take a vacation to the coast this summer","the children played happily in the park until the sun went down","he studied hard for the exam and passed with flying colors","my favorite restaurant serves the most delicious pasta in the whole town","the mountains were covered with fresh snow and looked absolutely beautiful","they bought a new house near the lake just last month","i need to finish this project before the deadline tomorrow morning","the concert was amazing and the band played all through the night","she loves to read mystery novels by the fireplace in winter","we watched the sunset from the top of the hill last evening","the dog chased the ball across the yard with tremendous excitement","he learned to play piano when he was just five years old","my grandmother makes the best apple pie for every thanksgiving dinner","the city lights sparkle brightly against the dark velvet night sky","they went hiking through the forest and spotted many wild animals","the teacher explained the difficult lesson very clearly to all her students","we celebrated her birthday with a big surprise party at her house","the storm brought heavy rain and strong winds to the coastal area","she dreams of traveling to paris and visiting the eiffel tower someday","we planted a small vegetable garden in the backyard together last spring","the coffee shop was packed with students all studying for exams","we took a long road trip across the country and saw amazing things","i finally finished reading that thick novel after three very long weeks","he volunteers at the animal shelter every saturday morning without fail","the train arrived late due to technical problems on the tracks","we ordered pizza and watched films together all night long at home","she taught herself how to knit by watching online tutorial videos","he fixed the broken bicycle in the garage with only a few spare parts","the morning sun broke through the clouds and warmed the quiet garden","the puppy knocked over the flower vase and looked very sorry afterward","she spent the afternoon baking fresh cookies and listening to soft music","the village held a festival every summer with music dancing and street food","we hiked all the way to the top of the ridge for the breathtaking view","the detective carefully pieced together the mystery using only a handful of clues","she graduated at the top of her class despite working full time throughout","the children built a cozy fort in the living room using cushions and sheets","the market opens early on saturday mornings with vendors selling fresh local produce","he wrote long letters to his family while traveling abroad for several months","they tried a new recipe that evening and ended up making a wonderful dinner"
  ],
  hard: [
    "the old library contains thousands of rare volumes from centuries ago and welcomes all visitors","my sister is studying medicine at a prestigious university abroad on a full scholarship","the museum displayed an extraordinary collection of ancient artifacts and mysterious historical treasures","the artist painted a stunning portrait using traditional oil painting techniques learned in italy","the scientist discovered a new butterfly species living deep in the amazon rainforest this year","the championship game went into dramatic overtime before the deciding goal was finally scored","my parents are celebrating their golden anniversary together at a very special restaurant downtown tonight","the airplane landed safely despite experiencing severe turbulence throughout the entire stormy return flight","the orchestra performed beethoven symphony to a completely sold out and tremendously enthusiastic crowd","the international conference brought together leading researchers from dozens of different countries worldwide","the documentary carefully explored the complicated relationship between technology and society over recent decades","the construction project transformed the abandoned warehouse district into a vibrant and thriving cultural hub","the detective pieced together the elaborate mystery using only a few seemingly unrelated minor clues","the ancient temple survived earthquakes floods fires and centuries of devastating conflict remarkably intact","scientists announced a major breakthrough in renewable energy storage that could fundamentally transform global power grids","the negotiations lasted three difficult days before both sides finally reached a mutually acceptable agreement","the symphony conductor drew incredible performances from the orchestra through subtle and very precise gestures","the startup raised significant venture capital funding and quickly expanded its entire operations internationally","volunteers coordinated comprehensive disaster relief efforts across multiple severely affected regions simultaneously throughout the crisis","the architect designed a building that maximizes natural light flow while also minimizing overall energy use","the novelist spent seven years deeply researching historical documents before writing even a single word","the diplomatic summit addressed pressing global issues including climate change inequality and complex regional security","the forensic team carefully analyzed all available evidence to reconstruct the precise sequence of events","the expedition team navigated extremely difficult terrain through monsoon season to reach the remote village","the startup disrupted traditional markets by offering a subscription service at a dramatically lower price point","she graduated at the very top of her class despite working full time throughout all university years","community organizers transformed neglected urban spaces into thriving gardens that neighbors actively help maintain","the professor challenged students to question fundamental assumptions underlying their well established theories","advanced algorithms now analyze medical imaging data faster and sometimes more accurately than experienced doctors","the ancient manuscript contained detailed astronomical observations that contradicted prevailing scientific understanding at that time"
  ],
  expert: [
    "the unprecedented acceleration of technological development has fundamentally restructured contemporary economic relationships across all major industries","philosophical investigations into the nature of consciousness continue to challenge neuroscientists attempting to provide systematic explanations","the biodiversity crisis threatens to undermine the foundational ecological systems upon which all agricultural civilization ultimately depends","sophisticated algorithms capable of processing extraordinary volumes of data have revolutionized approaches to scientific investigation methodologies","the constitutional framework establishing fundamental rights has proven remarkably resilient against persistent authoritarian challenges throughout modern history","electromagnetic radiation across the full spectrum carries fundamental information about the composition and behavior of distant astronomical objects","the psychological consequences of prolonged social isolation manifest quite differently across the various developmental stages of human maturity","comprehensive environmental sustainability requires deep transformation of manufacturing processes transportation infrastructure and consumption patterns simultaneously","the extraordinary complexity of international diplomatic negotiations reflects the genuinely multidimensional nature of contemporary geopolitical relationships","photosynthesis represents a remarkably sophisticated biochemical process through which plants convert electromagnetic radiation into stable chemical energy storage","the proliferation of interconnected digital infrastructure has created unprecedented vulnerabilities to sophisticated and coordinated international cyberattacks","quantitative methodologies increasingly supplement qualitative approaches in anthropological investigations of complex contemporary social phenomena worldwide","the decentralization of information dissemination through digital technologies has fundamentally challenged traditional institutional gatekeeping structures globally","the pharmaceutical industry invests extraordinary financial resources in rigorous clinical investigation to systematically demonstrate both efficacy and safety","evolutionary biology demonstrates how extraordinarily complex organizational structures emerge gradually through accumulation of incremental advantageous modifications","contemporary architectural philosophy increasingly emphasizes the profound relationship between built environments and the psychological wellbeing of inhabitants"
  ]
}

// ─────────────────────────────────────────────────────────────
// UTILS
// ─────────────────────────────────────────────────────────────
function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function getWords(diff, count) {
  const pool = {
    easy:   WORDS.easy,
    normal: [...WORDS.easy.slice(0, 80), ...WORDS.normal],
    hard:   [...WORDS.normal.slice(0, 80), ...WORDS.hard],
    expert: [...WORDS.hard.slice(0, 60), ...WORDS.expert]
  }[diff] || WORDS.normal
  const s = shuffle(pool)
  const out = []
  while (out.length < count) out.push(...s.slice(0, Math.min(count - out.length, s.length)))
  return out.slice(0, count)
}

function randomSentence(diff) {
  const pool = SENTENCES[diff] || SENTENCES.normal
  return pool[Math.floor(Math.random() * pool.length)]
}

function fmtTime(s) {
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`
}

function loadPrefs() {
  try { return JSON.parse(localStorage.getItem("tt-prefs-v2")) || {} } catch { return {} }
}
function savePrefs(p) { try { localStorage.setItem("tt-prefs-v2", JSON.stringify(p)) } catch {} }

// ─────────────────────────────────────────────────────────────
// ZEN AUDIO HOOK
// ─────────────────────────────────────────────────────────────
function useZenAudio() {
  const ref = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [vol, setVol] = useState(-14)

  const start = useCallback(async () => {
    if (ref.current) return
    await Tone.start()
    const reverb = new Tone.Reverb({ decay: 6, wet: 0.55 })
    const delay  = new Tone.FeedbackDelay("8n", 0.2)
    const volume = new Tone.Volume(vol)
    const filter = new Tone.Filter(600, "lowpass")
    filter.connect(delay)
    delay.connect(volume)
    volume.connect(reverb)
    reverb.toDestination()

    const pad = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "sine" },
      envelope: { attack: 2.5, decay: 1, sustain: 0.7, release: 5 },
      volume: -4
    }).connect(filter)

    const bell = new Tone.Synth({
      oscillator: { type: "triangle" },
      envelope: { attack: 0.1, decay: 0.8, sustain: 0.1, release: 3 },
      volume: -14
    }).connect(filter)

    const chords = [["A2","E3","C4","A4"],["F2","C3","A3","F4"],["C3","G3","E4","C5"],["G2","D3","B3","G4"]]
    const bells  = ["E5","A5","C6","B5","A5","G5","F5","E5","D5","C5"]
    let ci = 0, bi = 0

    const padLoop = new Tone.Loop(time => {
      pad.triggerAttackRelease(chords[ci % 4], "6n", time)
      ci++
    }, "4m")

    const bellLoop = new Tone.Loop(time => {
      if (Math.random() > 0.35) bell.triggerAttackRelease(bells[bi % bells.length], "8n", time)
      bi++
    }, "2n")

    Tone.Transport.bpm.value = 52
    padLoop.start(0)
    bellLoop.start("2m")
    Tone.Transport.start()
    ref.current = { pad, bell, filter, delay, volume, reverb, padLoop, bellLoop }
    setPlaying(true)
  }, [vol])

  const stop = useCallback(() => {
    if (!ref.current) return
    const { pad, bell, filter, delay, volume, reverb, padLoop, bellLoop } = ref.current
    Tone.Transport.stop()
    ;[padLoop, bellLoop].forEach(n => { try { n.stop(); n.dispose() } catch {} })
    ;[pad, bell, filter, delay, volume, reverb].forEach(n => { try { n.disconnect(); n.dispose() } catch {} })
    ref.current = null
    setPlaying(false)
  }, [])

  const changeVol = useCallback((db) => {
    setVol(db)
    if (ref.current) ref.current.volume.volume.value = db
  }, [])

  useEffect(() => () => stop(), [stop])
  return { playing, start, stop, vol, changeVol }
}

// ─────────────────────────────────────────────────────────────
// TYPING HOOK
// ─────────────────────────────────────────────────────────────
const BUFFER = 60
function useTypingTest(params) {
  const { difficulty = "easy", mode = "words", timeLimit = 30, wordCount = 25, useSentences = false } = params
  const p = useRef(params)
  useEffect(() => { p.current = params }, [params])

  const mkWords = useCallback((pp) => {
    if (pp.useSentences) return randomSentence(pp.difficulty).split(" ")
    return getWords(pp.difficulty, pp.mode === "time" ? BUFFER : pp.wordCount)
  }, [])

  const [words, setWords]       = useState(() => mkWords(params))
  const [idx, setIdx]           = useState(0)
  const [input, setInput]       = useState("")
  const [results, setResults]   = useState([])    // "correct"|"incorrect"
  const [charData, setCharData] = useState([])
  const [wrongs, setWrongs]     = useState([])
  const [history, setHistory]   = useState([])
  const [status, setStatus]     = useState("idle")
  const [elapsed, setElapsed]   = useState(0)
  const [remaining, setRemaining] = useState(timeLimit)
  const [wpm, setWpm]           = useState(0)
  const [acc, setAcc]           = useState(0)
  const [totalChars, setTC]     = useState(0)

  const timer = useRef(null)
  const t0    = useRef(null)

  const stopTimer = useCallback(() => { clearInterval(timer.current); timer.current = null }, [])

  const calcStats = useCallback((res, secs) => {
    if (!res.length || secs <= 0) return { wpm: 0, acc: 0 }
    const correct = res.filter(r => r === "correct").length
    return {
      wpm: Math.round(correct / (secs / 60)),
      acc: Math.round((correct / res.length) * 100)
    }
  }, [])

  const finish = useCallback((res, secs) => {
    stopTimer()
    setStatus("finished")
    const s = calcStats(res, secs)
    setWpm(s.wpm); setAcc(s.acc)
  }, [stopTimer, calcStats])

  const handleInput = useCallback((val) => {
    if (status === "finished") return
    const pp = p.current
    const isTime = pp.mode === "time"

    if (status === "idle" && val.length > 0) {
      setStatus("running")
      t0.current = Date.now()
      if (isTime) {
        timer.current = setInterval(() => {
          setRemaining(r => {
            if (r <= 1) {
              setTimeout(() => {
                setResults(prev => { finish(prev, pp.timeLimit); return prev })
              }, 0)
              return 0
            }
            return r - 1
          })
        }, 1000)
      } else {
        timer.current = setInterval(() => setElapsed(e => e + 1), 1000)
      }
    }

    // Virtual space for backtrack
    if (val === "" && input === " " && idx > 0) {
      setIdx(i => i - 1)
      const prev = (charData[idx - 1] || []).map(c => c.ch).join("")
      setInput(prev)
      return
    }
    if (val === "" && input !== "" && idx > 0) { setInput(" "); return }

    // Track char data
    const word = words[idx] || ""
    if (word && val.length > 0) {
      const wd = [...(charData[idx] || [])]
      for (let i = 0; i < val.length; i++) {
        const tc = val[i], ec = word[i], ex = wd[i]
        if (ec) {
          if (tc === ec) {
            wd[i] = { ch: ec, s: (ex?.wasErr ? "corrected" : "clean"), wasErr: ex?.wasErr }
          } else {
            wd[i] = { ch: ec, s: "error", wasErr: true }
          }
        } else { wd[i] = { ch: tc, s: "error", wasErr: true } }
      }
      for (let i = val.length; i < wd.length; i++) if (wd[i]) wd[i] = { ...wd[i], s: "pending" }
      setCharData(prev => { const n = [...prev]; n[idx] = wd; return n })
    }

    if (val.endsWith(" ")) {
      const typed = val.trim()
      if (!typed) { setInput(""); return }
      const expected = words[idx]
      const correct = typed === expected
      const newRes = [...results, correct ? "correct" : "incorrect"]

      if (!correct) setWrongs(prev => prev.some(w => w.e === expected && w.t === typed) ? prev : [...prev, { e: expected, t: typed }])
      else setTC(c => c + expected.length)

      setResults(newRes)
      setInput("")
      const next = idx + 1

      if (!isTime && !pp.useSentences && next >= words.length) {
        finish(newRes, elapsed + 1); return
      }
      if (isTime && !pp.useSentences && next > words.length - 12) {
        setWords(prev => [...prev, ...getWords(pp.difficulty, BUFFER)])
      }
      if (pp.useSentences && next >= words.length) {
        setWords(randomSentence(pp.difficulty).split(" "))
        setIdx(0); setCharData([]); setResults([])
        const s = calcStats(newRes, elapsed + 1)
        setWpm(s.wpm); setAcc(s.acc)
        return
      }
      if ((isTime ? (elapsed > 0 && elapsed % 15 === 0) : (next % 10 === 0 && next > 0))) {
        const secs = isTime ? (pp.timeLimit - remaining) : elapsed
        const snap = calcStats(newRes, secs || 1)
        setHistory(h => [...h, { label: isTime ? `${secs}s` : `${next}w`, wpm: snap.wpm }])
      }
      const secs2 = isTime ? (pp.timeLimit - remaining) : elapsed
      const s2 = calcStats(newRes, secs2 || 1)
      setWpm(s2.wpm); setAcc(s2.acc)
      setIdx(next)
      return
    }

    setInput(val)
    if (!isTime && !pp.useSentences && idx === words.length - 1 && val === words[idx]) {
      const nr = [...results, "correct"]
      setTC(c => c + val.length)
      finish(nr, elapsed + 1)
    }
  }, [status, words, idx, input, results, charData, elapsed, remaining, calcStats, finish])

  const reset = useCallback((np) => {
    stopTimer()
    const pp = np || p.current
    setWords(mkWords(pp))
    setIdx(0); setInput(""); setResults([])
    setCharData([]); setWrongs([]); setHistory([])
    setStatus("idle"); setElapsed(0)
    setRemaining(pp.mode === "time" ? (pp.timeLimit || 30) : pp.timeLimit)
    setWpm(0); setAcc(0); setTC(0)
    t0.current = null
  }, [stopTimer, mkWords])

  useEffect(() => () => stopTimer(), [stopTimer])

  return { words, idx, input, results, charData, wrongs, history, status, elapsed, remaining, wpm, acc, totalChars, handleInput, reset }
}

// ─────────────────────────────────────────────────────────────
// CSS - IMPROVED CONTRAST
// ─────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,400;0,600;1,400&family=IBM+Plex+Mono:wght@300;400;500&family=Caveat:wght@400;600&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Mono:wght@400;500&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;1,9..144,300&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

/* ── THEME VARIABLES (IMPROVED CONTRAST) ── */
:root,[data-theme="space"]{
  --bg:#0a0916;--surf:rgba(16,14,32,0.82);--surf2:rgba(22,20,44,0.9);
  --bdr:rgba(90,80,160,0.22);--glow:rgba(139,92,246,0.35);
  --dim:#6a68a0;--pend:#9090c8;--act:#f5f3ff;
  --clean:#34d399;--corr:#fbbf24;--err:#f472b6;--cursor:#c084fc;
  --acc:#8b5cf6;--acc2:#a78bfa;--lbl:#7a78a8;--stat:#b0aed8;
  --font:'IBM Plex Mono',monospace;--wsize:clamp(20px,2.2vw,33px);
  --lh:1.85;--rad:18px;--shadow:0 16px 48px rgba(0,0,0,0.6);
  --bggrad:radial-gradient(ellipse at 25% 40%,#2d1b6960 0,transparent 55%),radial-gradient(ellipse at 75% 70%,#1a2b5040 0,transparent 55%),radial-gradient(ellipse at 50% 0%,#0d0a2280 0,transparent 60%),#060514;
}
[data-theme="flower"]{
  --bg:#f8f4ef;--surf:rgba(255,252,248,0.92);--surf2:rgba(255,250,245,0.97);
  --bdr:rgba(200,170,150,0.35);--glow:rgba(236,72,153,0.18);
  --dim:#a08878;--pend:#685850;--act:#1a1410;
  --clean:#059669;--corr:#d97706;--err:#e11d48;--cursor:#db2777;
  --acc:#db2777;--acc2:#f472b6;--lbl:#887868;--stat:#2a2018;
  --font:'Crimson Pro',Georgia,serif;--wsize:clamp(24px,2.8vw,42px);
  --lh:2;--rad:24px;--shadow:0 8px 32px rgba(0,0,0,0.08);
  --bggrad:radial-gradient(ellipse at 30% 30%,#fce8f360 0,transparent 55%),radial-gradient(ellipse at 70% 70%,#fef3c740 0,transparent 55%),#faf5ef;
}
[data-theme="ocean"]{
  --bg:#040e1e;--surf:rgba(8,20,40,0.85);--surf2:rgba(12,28,52,0.92);
  --bdr:rgba(30,100,160,0.22);--glow:rgba(56,189,248,0.3);
  --dim:#3a6890;--pend:#6090b8;--act:#e8f8ff;
  --clean:#22d3ee;--corr:#fbbf24;--err:#fb7185;--cursor:#7dd3fc;
  --acc:#0ea5e9;--acc2:#38bdf8;--lbl:#5a88a8;--stat:#98c8e8;
  --font:'DM Mono','Courier New',monospace;--wsize:clamp(18px,2vw,30px);
  --lh:1.9;--rad:8px;--shadow:0 14px 44px rgba(0,10,30,0.7);
  --bggrad:radial-gradient(ellipse at 50% 0%,#0a456640 0,transparent 60%),radial-gradient(ellipse at 20% 80%,#01152800 0,transparent 50%),#030c1a;
}
[data-theme="autumn"]{
  --bg:#1c1108;--surf:rgba(45,28,16,0.88);--surf2:rgba(58,36,20,0.93);
  --bdr:rgba(160,100,50,0.22);--glow:rgba(251,146,60,0.22);
  --dim:#8a6840;--pend:#b89860;--act:#fffaee;
  --clean:#84cc16;--corr:#f59e0b;--err:#ef4444;--cursor:#fb923c;
  --acc:#ea580c;--acc2:#f97316;--lbl:#aa8050;--stat:#d8b880;
  --font:'Playfair Display',Georgia,serif;--wsize:clamp(22px,2.6vw,40px);
  --lh:1.85;--rad:12px;--shadow:0 12px 40px rgba(0,0,0,0.5);
  --bggrad:radial-gradient(ellipse at 30% 70%,#5c2a0e50 0,transparent 55%),radial-gradient(ellipse at 70% 20%,#8b451340 0,transparent 50%),#120a04;
}
[data-theme="handwritten"]{
  --bg:#f7f3ec;--surf:rgba(255,252,247,0.95);--surf2:rgba(252,249,244,0.98);
  --bdr:rgba(150,140,120,0.28);--glow:rgba(59,130,246,0.1);
  --dim:#888068;--pend:#585040;--act:#1a1810;
  --clean:#16a34a;--corr:#ca8a04;--err:#dc2626;--cursor:#2563eb;
  --acc:#1d4ed8;--acc2:#3b82f6;--lbl:#6a6050;--stat:#2a2820;
  --font:'Caveat','Bradley Hand',cursive;--wsize:clamp(26px,3.2vw,48px);
  --lh:1.6;--rad:6px;--shadow:0 4px 20px rgba(0,0,0,0.06);
  --bggrad:repeating-linear-gradient(transparent,transparent 39px,#d4c5a938 39px,#d4c5a938 40px),linear-gradient(160deg,#f7f3ec,#ede8df);
}

/* ── LAYOUT ── */
body{overflow-x:hidden}
.app{
  min-height:100dvh;width:100%;
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  background:var(--bggrad);
  padding:clamp(12px,3vw,32px);
  font-family:var(--font);
  transition:background 0.6s ease;
}

/* ── SCREEN TRANSITIONS ── */
.screen{width:100%;max-width:860px;animation:screenIn 0.4s cubic-bezier(0.22,1,0.36,1) both}
.screen.out{animation:screenOut 0.3s cubic-bezier(0.4,0,1,1) both}
@keyframes screenIn{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
@keyframes screenOut{from{opacity:1;transform:translateY(0)}to{opacity:0;transform:translateY(-20px)}}

/* ── LOGO ── */
.logo{
  text-align:center;margin-bottom:clamp(24px,4vw,44px);
  letter-spacing:-0.02em;font-weight:600;
  font-size:clamp(28px,4vw,48px);color:var(--act);opacity:0.95;
  text-shadow:0 0 40px var(--glow);
  animation:logoGlow 4s ease-in-out infinite alternate;
}
@keyframes logoGlow{from{text-shadow:0 0 20px var(--glow)}to{text-shadow:0 0 60px var(--glow),0 0 100px var(--glow)}}
.logo span{color:var(--acc)}

/* ── CARD ── */
.card{
  background:var(--surf);border:1px solid var(--bdr);
  border-radius:var(--rad);padding:clamp(32px,5vw,64px) clamp(28px,5vw,72px);
  backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);
  box-shadow:var(--shadow);
  max-width:clamp(900px,90vw,1200px);
}

/* ── SETTINGS SCREEN ── */
.settings-grid{display:flex;flex-direction:column;gap:clamp(18px,2.5vw,28px)}
.settings-row{display:flex;flex-wrap:wrap;gap:10px;align-items:center}
.settings-label{font-size:clamp(9px,1vw,11px);letter-spacing:0.12em;text-transform:uppercase;color:var(--lbl);width:100%;margin-bottom:2px}
.pill-group{display:flex;flex-wrap:wrap;gap:6px}
.pill{
  padding:7px 16px;border-radius:100px;border:1px solid var(--bdr);
  background:transparent;color:var(--pend);font-family:var(--font);
  font-size:clamp(11px,1.1vw,14px);cursor:pointer;transition:all 0.18s;letter-spacing:0.03em;
}
.pill:hover{border-color:var(--acc2);color:var(--act)}
.pill.active{background:var(--acc);border-color:var(--acc);color:#fff;box-shadow:0 2px 12px var(--glow)}
.pill.diff-easy.active{background:#059669;border-color:#059669}
.pill.diff-normal.active{background:#0ea5e9;border-color:#0ea5e9}
.pill.diff-hard.active{background:#f59e0b;border-color:#f59e0b}
.pill.diff-expert.active{background:#ef4444;border-color:#ef4444}

/* ── THEME SWATCHES ── */
.theme-swatches{display:flex;gap:8px;flex-wrap:wrap}
.swatch{
  width:34px;height:34px;border-radius:50%;border:2px solid transparent;
  cursor:pointer;transition:all 0.2s;position:relative;
}
.swatch:hover{transform:scale(1.12)}
.swatch.active{border-color:var(--act);box-shadow:0 0 0 2px var(--acc)}
.swatch-space   {background:radial-gradient(circle at 40% 40%,#6d28d9,#0a0514)}
.swatch-flower  {background:radial-gradient(circle at 40% 40%,#f9a8d4,#faf5ef)}
.swatch-ocean   {background:radial-gradient(circle at 40% 40%,#38bdf8,#03071e)}
.swatch-autumn  {background:radial-gradient(circle at 40% 40%,#f97316,#120a04)}
.swatch-handwritten{background:radial-gradient(circle at 40% 40%,#93c5fd,#f7f3ec)}

/* ── START BUTTON ── */
.start-btn{
  width:100%;margin-top:clamp(8px,2vw,20px);
  padding:clamp(14px,2vw,20px);border-radius:var(--rad);
  border:1px solid var(--acc);background:var(--acc);
  color:#fff;font-family:var(--font);font-size:clamp(13px,1.3vw,16px);
  letter-spacing:0.06em;text-transform:uppercase;cursor:pointer;
  transition:all 0.2s;box-shadow:0 4px 20px var(--glow);
}
.start-btn:hover{background:var(--acc2);transform:translateY(-2px);box-shadow:0 8px 32px var(--glow)}
.start-btn:active{transform:translateY(0)}
.zen-btn{
  width:100%;padding:clamp(10px,1.5vw,14px);border-radius:var(--rad);
  border:1px solid var(--bdr);background:transparent;
  color:var(--pend);font-family:var(--font);font-size:clamp(12px,1.1vw,14px);
  letter-spacing:0.06em;text-transform:uppercase;cursor:pointer;
  transition:all 0.2s;margin-top:8px;
}
.zen-btn:hover{border-color:var(--acc2);color:var(--acc2)}

/* ── TYPING SCREEN ── */
.typing-wrap{display:flex;flex-direction:column;gap:clamp(16px,2vw,28px)}
.stats-bar{display:flex;align-items:center;gap:clamp(12px,2vw,28px);flex-wrap:wrap}
.stat-item{display:flex;flex-direction:column;gap:2px}
.stat-val{font-size:clamp(18px,2.5vw,32px);color:var(--act);font-weight:600;line-height:1;transition:color 0.2s}
.stat-val.urgent{color:var(--err);animation:pulse 0.8s ease infinite}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}
.stat-key{font-size:clamp(8px,0.9vw,11px);letter-spacing:0.12em;text-transform:uppercase;color:var(--lbl)}
.stats-bar .pill-group{margin-left:auto}
.stats-bar .pill{
  padding:8px 18px;border:1px solid var(--acc);
  background:var(--acc);color:#fff;font-weight:500;
  box-shadow:0 2px 12px var(--glow);
}
.stats-bar .pill:hover{
  background:var(--acc2);border-color:var(--acc2);
  transform:translateY(-1px);box-shadow:0 4px 16px var(--glow);
}

/* ── PROGRESS BAR ── */
.prog-track{height:3px;background:var(--bdr);border-radius:2px;overflow:hidden;margin-bottom:clamp(8px,1.5vw,16px)}
.prog-fill{height:100%;background:var(--acc);border-radius:2px;transition:width 0.3s ease;box-shadow:0 0 8px var(--glow)}

/* ── WORDS AREA ── */
.words-outer{
  position:relative;max-height:clamp(100px,20vw,200px);overflow:hidden;
  mask-image:linear-gradient(to bottom,transparent 0%,black 8%,black 88%,transparent 100%);
  -webkit-mask-image:linear-gradient(to bottom,transparent 0%,black 8%,black 88%,transparent 100%);
}
.words-outer.blurred .words-inner{filter:blur(5px)}
.words-inner{display:flex;flex-wrap:wrap;gap:clamp(4px,0.7vw,10px);padding:12px 4px;line-height:var(--lh)}
.word{font-size:var(--wsize);cursor:default;transition:opacity 0.15s}
.word-dim{opacity:0.4;color:var(--dim)}
.word-done{opacity:0.7;color:var(--pend)}
.word-active{color:var(--act)}
.ch{transition:color 0.08s}
.ch-pending{color:var(--pend)}
.ch-cursor{color:var(--act);position:relative}
.ch-cursor::before{content:"";position:absolute;left:0;bottom:-2px;width:2px;height:90%;background:var(--cursor);animation:blink 1.1s step-end infinite;border-radius:1px}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
.ch-clean{color:var(--clean)}
.ch-corr{color:var(--corr)}
.ch-err{color:var(--err)}
.focus-hint{
  position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
  font-size:clamp(12px,1.2vw,16px);color:var(--lbl);letter-spacing:0.08em;text-transform:uppercase;
  cursor:text;
}

/* HIDDEN INPUT */
.hidden-input{position:fixed;opacity:0;pointer-events:none;width:1px;height:1px;top:-999px}

/* ── RESULTS SCREEN ── */
.results-title{font-size:clamp(24px,5vw,60px);color:var(--act);margin-bottom:clamp(16px,3vw,36px);opacity:0.9;font-weight:600}
.results-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(100px,1fr));gap:clamp(10px,2vw,20px);margin-bottom:clamp(20px,3vw,36px)}
.res-card{
  background:var(--surf2);border:1px solid var(--bdr);border-radius:var(--rad);
  padding:clamp(14px,2vw,24px) clamp(12px,1.5vw,20px);text-align:center;
}
.res-card.accent{border-color:var(--acc);box-shadow:0 4px 20px var(--glow)}
.res-num{font-size:clamp(22px,3.5vw,48px);color:var(--act);font-weight:700;line-height:1}
.res-lbl{font-size:clamp(9px,0.9vw,12px);color:var(--lbl);letter-spacing:0.1em;text-transform:uppercase;margin-top:4px}
.chart-wrap{margin-bottom:clamp(16px,2.5vw,28px)}
.chart-title{font-size:clamp(9px,0.9vw,11px);color:var(--lbl);letter-spacing:0.12em;text-transform:uppercase;margin-bottom:clamp(8px,1.2vw,16px)}
.chart{display:flex;align-items:flex-end;gap:clamp(4px,0.8vw,10px);height:clamp(60px,12vw,120px)}
.bar-col{display:flex;flex-direction:column;align-items:center;gap:4px;flex:1;min-width:0}
.bar-val{font-size:clamp(8px,0.8vw,11px);color:var(--stat)}
.bar-wrap{flex:1;width:100%;display:flex;align-items:flex-end}
.bar{width:100%;background:var(--acc);border-radius:4px 4px 0 0;min-height:4px;opacity:0.8;transition:height 0.4s ease}
.bar-lbl{font-size:clamp(7px,0.7vw,10px);color:var(--dim);white-space:nowrap;overflow:hidden;max-width:100%;text-overflow:ellipsis}
.wrongs-wrap{margin-bottom:clamp(16px,2.5vw,28px)}
.wrong-list{display:flex;flex-wrap:wrap;gap:clamp(6px,1vw,12px);margin-top:clamp(8px,1.2vw,16px)}
.wrong-item{background:var(--surf2);border:1px solid var(--bdr);border-radius:8px;padding:6px 12px;font-size:clamp(11px,1vw,14px);display:flex;gap:8px;align-items:center}
.wrong-e{color:var(--clean)}.wrong-arr{color:var(--dim)}.wrong-t{color:var(--err)}
.actions{display:flex;gap:10px;flex-wrap:wrap}
.action-btn{
  padding:clamp(10px,1.5vw,16px) clamp(20px,3vw,36px);border-radius:var(--rad);
  border:1px solid var(--bdr);background:transparent;
  color:var(--act);font-family:var(--font);font-size:clamp(12px,1.1vw,14px);
  letter-spacing:0.06em;text-transform:uppercase;cursor:pointer;transition:all 0.18s;
}
.action-btn:hover{border-color:var(--acc);color:var(--acc)}
.action-btn.primary{background:var(--acc);border-color:var(--acc);color:#fff;box-shadow:0 4px 16px var(--glow)}
.action-btn.primary:hover{background:var(--acc2);border-color:var(--acc2);transform:translateY(-1px)}

/* ── ZEN MODE ── */
.zen-overlay{
  position:fixed;inset:0;z-index:100;
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  padding:clamp(16px,4vw,48px);
  transition:filter 0.4s;
}
.zen-bg{position:fixed;inset:0;background:var(--bggrad);z-index:-1;transition:filter 0.4s}
.zen-bg.hue-rotated{filter:hue-rotate(var(--zen-hue,0deg)) saturate(var(--zen-sat,1))}
.zen-particles{position:fixed;inset:0;z-index:-1;pointer-events:none;overflow:hidden}
.zen-particle{
  position:absolute;border-radius:50%;background:var(--acc);opacity:0;
  animation:float linear infinite;
}
@keyframes float{
  0%{opacity:0;transform:translateY(100vh) scale(0)}
  10%{opacity:var(--pop,0.3)}
  90%{opacity:var(--pop,0.3)}
  100%{opacity:0;transform:translateY(-20px) scale(1)}
}
.zen-content{width:100%;max-width:760px}
.zen-words{
  font-size:var(--wsize);line-height:var(--lh);
  display:flex;flex-wrap:wrap;gap:clamp(4px,0.8vw,12px);
  max-height:clamp(120px,22vw,240px);overflow:hidden;
  mask-image:linear-gradient(to bottom,transparent,black 10%,black 90%,transparent);
  -webkit-mask-image:linear-gradient(to bottom,transparent,black 10%,black 90%,transparent);
  padding:16px 4px;
}
.zen-stats{display:flex;gap:clamp(16px,3vw,40px);margin-bottom:clamp(16px,2vw,28px);opacity:0.7;color:var(--act)}
.zen-stat{font-size:clamp(13px,1.5vw,18px);color:var(--act)}
.zen-controls{
  position:fixed;bottom:clamp(16px,3vw,32px);right:clamp(16px,3vw,32px);
  display:flex;flex-direction:column;align-items:flex-end;gap:10px;
}
.zen-gear-btn{
  width:40px;height:40px;border-radius:50%;border:1px solid var(--bdr);
  background:var(--surf);color:var(--lbl);cursor:pointer;
  display:flex;align-items:center;justify-content:center;font-size:18px;
  transition:all 0.2s;backdrop-filter:blur(12px);
}
.zen-gear-btn:hover{border-color:var(--acc);color:var(--acc)}
.zen-panel{
  background:var(--surf);border:1px solid var(--bdr);border-radius:var(--rad);
  padding:clamp(16px,2.5vw,28px);min-width:clamp(200px,28vw,280px);
  box-shadow:var(--shadow);backdrop-filter:blur(20px);
  display:flex;flex-direction:column;gap:14px;
}
.zen-panel-title{font-size:clamp(9px,0.9vw,11px);color:var(--lbl);letter-spacing:0.12em;text-transform:uppercase;margin-bottom:4px}
.zen-row{display:flex;flex-direction:column;gap:6px}
.zen-row-label{font-size:clamp(9px,0.9vw,11px);color:var(--lbl);letter-spacing:0.08em;text-transform:uppercase}
.zen-slider{width:100%;accent-color:var(--acc);cursor:pointer}
.zen-toggle{
  display:flex;gap:6px;
}
.zen-exit{
  position:fixed;top:clamp(12px,2vw,20px);left:clamp(12px,2vw,20px);
  padding:8px 16px;border-radius:100px;border:1px solid var(--bdr);
  background:var(--surf);color:var(--lbl);font-family:var(--font);
  font-size:clamp(10px,1vw,12px);letter-spacing:0.08em;text-transform:uppercase;
  cursor:pointer;transition:all 0.2s;backdrop-filter:blur(12px);
}
.zen-exit:hover{border-color:var(--acc);color:var(--acc)}
.zen-breathing{
  position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);
  width:clamp(300px,60vw,600px);height:clamp(300px,60vw,600px);
  border-radius:50%;
  background:radial-gradient(circle,var(--glow) 0%,transparent 70%);
  animation:breathe 8s ease-in-out infinite;
  pointer-events:none;z-index:-1;
}
@keyframes breathe{0%,100%{transform:translate(-50%,-50%) scale(0.85);opacity:0.3}50%{transform:translate(-50%,-50%) scale(1.15);opacity:0.7}}

/* ── RESPONSIVE ── */
@media(max-width:640px){
  .card{padding:20px 18px}
  .stats-bar .pill-group{margin-left:0;width:100%}
  .results-grid{grid-template-columns:repeat(2,1fr)}
  .zen-panel{min-width:180px}
}
`

// ─────────────────────────────────────────────────────────────
// CHAR RENDER HELPERS
// ─────────────────────────────────────────────────────────────
function renderWord(word, charData, input, isCurrent, isDone) {
  if (isCurrent) {
    const len = Math.max(word.length, input.length)
    return Array.from({ length: len }, (_, i) => {
      const ec = word[i], tc = input[i], info = charData?.[i]
      if (i >= input.length) {
        return <span key={i} className={`ch ${i === input.length ? "ch-cursor" : "ch-pending"}`}>{ec || ""}</span>
      }
      const s = info?.s || (tc === ec ? "clean" : "error")
      return <span key={i} className={`ch ch-${s === "corrected" ? "corr" : s}`}>{ec || tc}</span>
    })
  }
  if (isDone) {
    return (word || "").split("").map((c, i) => {
      const s = charData?.[i]?.s || "clean"
      return <span key={i} className={`ch ch-${s === "corrected" ? "corr" : s}`}>{c}</span>
    })
  }
  return word
}

// ─────────────────────────────────────────────────────────────
// SETTINGS SCREEN
// ─────────────────────────────────────────────────────────────
const DIFFS   = ["easy","normal","hard","expert"]
const MODES   = ["words","time","sentences"]
const TIMES   = [15,30,60,120]
const COUNTS  = [10,25,50,100]
const THEMES  = ["space","flower","ocean","autumn","handwritten"]

function SettingsScreen({ settings, onChange, onStart, onZen }) {
  const { difficulty, mode, timeLimit, wordCount, theme } = settings

  return (
    <div className="card">
      <div className="settings-grid">
        <div>
          <div className="settings-label">Theme</div>
          <div className="theme-swatches">
            {THEMES.map(t => (
              <div key={t} className={`swatch swatch-${t} ${theme === t ? "active" : ""}`}
                onClick={() => onChange("theme", t)} title={t} />
            ))}
          </div>
        </div>
        <div>
          <div className="settings-label">Mode</div>
          <div className="pill-group">
            {MODES.map(m => (
              <button key={m} className={`pill ${mode === m ? "active" : ""}`}
                onClick={() => onChange("mode", m)}>{m}</button>
            ))}
            <button className="pill" onClick={onZen} style={{ borderColor: "var(--acc)", color: "var(--acc2)" }}>✦ zen</button>
          </div>
        </div>
        <div>
          <div className="settings-label">Difficulty</div>
          <div className="pill-group">
            {DIFFS.map(d => (
              <button key={d} className={`pill diff-${d} ${difficulty === d ? "active" : ""}`}
                onClick={() => onChange("difficulty", d)}>{d}</button>
            ))}
          </div>
        </div>
        {mode === "time" && (
          <div>
            <div className="settings-label">Duration</div>
            <div className="pill-group">
              {TIMES.map(t => (
                <button key={t} className={`pill ${timeLimit === t ? "active" : ""}`}
                  onClick={() => onChange("timeLimit", t)}>{t}s</button>
              ))}
            </div>
          </div>
        )}
        {mode === "words" && (
          <div>
            <div className="settings-label">Word Count</div>
            <div className="pill-group">
              {COUNTS.map(c => (
                <button key={c} className={`pill ${wordCount === c ? "active" : ""}`}
                  onClick={() => onChange("wordCount", c)}>{c}</button>
              ))}
            </div>
          </div>
        )}
        <button className="start-btn" onClick={onStart}>
          Start Typing →
        </button>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// TYPING SCREEN
// ─────────────────────────────────────────────────────────────
function TypingScreen({ settings, onComplete, onBack }) {
  const { mode, timeLimit, wordCount, difficulty } = settings
  const testParams = useMemo(() => ({
    difficulty, mode: mode === "sentences" ? "words" : mode,
    timeLimit, wordCount: mode === "time" ? 999 : wordCount,
    useSentences: mode === "sentences"
  }), [difficulty, mode, timeLimit, wordCount])

  const { words, idx, input, results, charData, wrongs, history, status, elapsed, remaining, wpm, acc, handleInput, reset } = useTypingTest(testParams)

  const inputRef = useRef(null)
  const wordsRef = useRef(null)
  const [focused, setFocused] = useState(true)

  const progress = mode === "time"
    ? ((timeLimit - remaining) / timeLimit) * 100
    : (idx / Math.max(words.length, 1)) * 100
  const displayTime = mode === "time" ? remaining : elapsed
  const isTyping = status === "running"

  useEffect(() => {
    if (status === "finished") {
      const timeUsed = mode === "time" ? timeLimit - remaining : elapsed
      onComplete({ wpm, acc, wrongs, history, words, results, timeUsed })
    }
  }, [status]) // eslint-disable-line

  useEffect(() => { inputRef.current?.focus() }, [])

  useEffect(() => {
    const el = wordsRef.current
    if (!el) return
    const cur = el.querySelector('[data-cur="1"]')
    if (!cur) return
    const top = cur.getBoundingClientRect().top - el.getBoundingClientRect().top
    if (top > el.clientHeight * 0.55) cur.scrollIntoView({ block: "center", behavior: "smooth" })
  }, [idx])

  return (
    <div className="typing-wrap card" onClick={() => inputRef.current?.focus()}>
      <div className="prog-track">
        <div className="prog-fill" style={{ width: `${Math.min(progress, 100)}%` }} />
      </div>
      <div className="stats-bar">
        <div className="stat-item">
          <div className={`stat-val ${mode === "time" && remaining <= 10 ? "urgent" : ""}`}>{fmtTime(displayTime)}</div>
          <div className="stat-key">time</div>
        </div>
        <div className="stat-item">
          <div className="stat-val">{wpm}</div>
          <div className="stat-key">wpm</div>
        </div>
        <div className="stat-item">
          <div className="stat-val">{acc > 0 ? `${acc}%` : "—"}</div>
          <div className="stat-key">acc</div>
        </div>
        {mode === "words" && (
          <div className="stat-item">
            <div className="stat-val">{idx}/{words.length}</div>
            <div className="stat-key">words</div>
          </div>
        )}
        <div className="pill-group" style={{ marginLeft: "auto" }}>
          <button className="pill" onClick={(e) => { e.stopPropagation(); reset() }}>restart</button>
          <button className="pill" onClick={(e) => { e.stopPropagation(); onBack() }}>← back</button>
        </div>
      </div>

      <div className="words-outer" ref={wordsRef} style={{ position: "relative" }}>
        {!focused && status === "idle" && (
          <div className="focus-hint" onClick={() => inputRef.current?.focus()}>
            click to focus
          </div>
        )}
        <div className={`words-inner ${!focused && status === "idle" ? "blurred" : ""}`}>
          {words.map((w, i) => (
            <span key={i} className={`word ${i < idx ? "word-done" : i === idx ? "word-active" : "word-dim"}`}
              data-cur={i === idx ? "1" : undefined}>
              {renderWord(w, charData[i], i === idx ? input : "", i === idx, i < idx)}
            </span>
          ))}
        </div>
      </div>

      <input
        ref={inputRef}
        className="hidden-input"
        value={input}
        onChange={e => handleInput(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        disabled={status === "finished"}
        autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false}
        aria-label="Typing input"
      />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// RESULTS SCREEN
// ─────────────────────────────────────────────────────────────
function ResultsScreen({ results, onRetry, onBack }) {
  const { wpm, acc, wrongs, history, timeUsed, words, results: wordResults } = results
  const chartData = [...history, { label: "final", wpm }]
  const maxWpm = Math.max(...chartData.map(h => h.wpm), 1)
  const correct = (wordResults || []).filter(r => r === "correct").length

  return (
    <div className="card">
      <div className="results-title">complete.</div>
      <div className="results-grid">
        <div className="res-card accent">
          <div className="res-num">{wpm}</div>
          <div className="res-lbl">wpm</div>
        </div>
        <div className="res-card">
          <div className="res-num">{acc}%</div>
          <div className="res-lbl">accuracy</div>
        </div>
        <div className="res-card">
          <div className="res-num">{correct}/{wordResults?.length || 0}</div>
          <div className="res-lbl">correct</div>
        </div>
        <div className="res-card">
          <div className="res-num">{fmtTime(timeUsed || 0)}</div>
          <div className="res-lbl">time</div>
        </div>
      </div>

      {chartData.length > 1 && (
        <div className="chart-wrap">
          <div className="chart-title">wpm over time</div>
          <div className="chart">
            {chartData.map((h, i) => (
              <div key={i} className="bar-col">
                <div className="bar-val">{h.wpm}</div>
                <div className="bar-wrap">
                  <div className="bar" style={{ height: `${Math.round((h.wpm / maxWpm) * 100)}%` }} />
                </div>
                <div className="bar-lbl">{h.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {wrongs.length > 0 && (
        <div className="wrongs-wrap">
          <div className="chart-title">missed words ({wrongs.length})</div>
          <div className="wrong-list">
            {wrongs.map((w, i) => (
              <div key={i} className="wrong-item">
                <span className="wrong-e">{w.e}</span>
                <span className="wrong-arr">→</span>
                <span className="wrong-t">{w.t}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="actions">
        <button className="action-btn primary" onClick={onRetry}>try again ↺</button>
        <button className="action-btn" onClick={onBack}>change settings</button>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// ZEN MODE SCREEN
// ─────────────────────────────────────────────────────────────
const ZEN_PARTICLES_COUNT = 22
function ZenScreen({ settings, onExit }) {
  const audio = useZenAudio()
  const [panelOpen, setPanelOpen] = useState(false)
  const [zenHue, setZenHue] = useState(0)
  const [zenSat, setZenSat] = useState(1)
  const [showWpm, setShowWpm] = useState(false)
  const [particles] = useState(() =>
    Array.from({ length: ZEN_PARTICLES_COUNT }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 12,
      dur: 14 + Math.random() * 18,
      size: 3 + Math.random() * 6,
      pop: 0.1 + Math.random() * 0.25
    }))
  )

  const testParams = useMemo(() => ({
    difficulty: settings.difficulty, mode: "time", timeLimit: 999, wordCount: 60, useSentences: false
  }), [settings.difficulty])

  const { words, idx, input, charData, status, elapsed, wpm, handleInput, reset } = useTypingTest(testParams)
  const inputRef = useRef(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  const handleKey = useCallback(e => {
    if (e.key === "Escape") onExit()
  }, [onExit])

  useEffect(() => {
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [handleKey])

  return (
    <div className="zen-overlay" onClick={() => inputRef.current?.focus()}>
      <div className="zen-breathing" />
      <div className="zen-bg hue-rotated" style={{ "--zen-hue": `${zenHue}deg`, "--zen-sat": zenSat }} />
      <div className="zen-particles">
        {particles.map(p => (
          <div key={p.id} className="zen-particle" style={{
            left: `${p.left}%`, width: p.size, height: p.size,
            animationDelay: `${p.delay}s`, animationDuration: `${p.dur}s`,
            "--pop": p.pop
          }} />
        ))}
      </div>

      <button className="zen-exit" onClick={onExit}>← exit zen</button>

      <div className="zen-content">
        {showWpm && (
          <div className="zen-stats">
            <span className="zen-stat">{fmtTime(elapsed)}</span>
            <span className="zen-stat">{wpm} wpm</span>
          </div>
        )}
        <div className="zen-words">
          {words.map((w, i) => (
            <span key={i} className={`word ${i < idx ? "word-done" : i === idx ? "word-active" : "word-dim"}`}
              data-cur={i === idx ? "1" : undefined}>
              {renderWord(w, charData[i], i === idx ? input : "", i === idx, i < idx)}
            </span>
          ))}
        </div>
      </div>

      <input ref={inputRef} className="hidden-input" value={input}
        onChange={e => handleInput(e.target.value)}
        autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false} />

      <div className="zen-controls">
        {panelOpen && (
          <div className="zen-panel">
            <div className="zen-panel-title">✦ zen settings</div>
            <div className="zen-row">
              <div className="zen-row-label">Color hue</div>
              <input type="range" className="zen-slider" min="0" max="360"
                value={zenHue} onChange={e => setZenHue(+e.target.value)} />
            </div>
            <div className="zen-row">
              <div className="zen-row-label">Saturation</div>
              <input type="range" className="zen-slider" min="0.2" max="2" step="0.05"
                value={zenSat} onChange={e => setZenSat(+e.target.value)} />
            </div>
            <div className="zen-row">
              <div className="zen-row-label">Music volume</div>
              <input type="range" className="zen-slider" min="-30" max="0" step="1"
                value={audio.vol} onChange={e => audio.changeVol(+e.target.value)} />
            </div>
            <div className="zen-toggle">
              <button className={`pill ${audio.playing ? "active" : ""}`}
                onClick={() => audio.playing ? audio.stop() : audio.start()}>
                {audio.playing ? "♪ music on" : "♪ music off"}
              </button>
              <button className={`pill ${showWpm ? "active" : ""}`}
                onClick={() => setShowWpm(v => !v)}>
                {showWpm ? "stats on" : "stats off"}
              </button>
            </div>
            <button className="action-btn" onClick={reset} style={{ padding: "8px 12px", fontSize: "11px" }}>
              new words
            </button>
          </div>
        )}
        <button className="zen-gear-btn" onClick={e => { e.stopPropagation(); setPanelOpen(v => !v) }}>
          {panelOpen ? "×" : "⚙"}
        </button>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────────────────────
const DEFAULT_SETTINGS = { difficulty: "normal", mode: "words", timeLimit: 30, wordCount: 25, theme: "space" }

export default function TypingApp() {
  const prefs = useMemo(() => loadPrefs(), [])
  const [settings, setSettings] = useState({ ...DEFAULT_SETTINGS, ...prefs })
  const [screen, setScreen] = useState("settings")   // settings | typing | results | zen
  const [animOut, setAnimOut] = useState(false)
  const [results, setResults] = useState(null)

  // Inject CSS + Google Fonts
  useEffect(() => {
    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = "https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,400;0,600;1,400&family=IBM+Plex+Mono:wght@300;400;500&family=Caveat:wght@400;600&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Mono:wght@400;500&family=Fraunces:opsz,wght@9..144,300;9..144,600;1,9..144,300&display=swap"
    document.head.appendChild(link)
    const style = document.createElement("style")
    style.textContent = CSS
    document.head.appendChild(style)
    return () => { link.remove(); style.remove() }
  }, [])

  // Apply theme to body bg
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", settings.theme)
    document.body.style.background = "var(--bg)"
  }, [settings.theme])

  const changeSetting = useCallback((key, val) => {
    setSettings(s => {
      const next = { ...s, [key]: val }
      savePrefs(next)
      return next
    })
  }, [])

  const go = useCallback((to) => {
    setAnimOut(true)
    setTimeout(() => { setScreen(to); setAnimOut(false) }, 280)
  }, [])

  const handleStart  = useCallback(() => go("typing"), [go])
  const handleZen    = useCallback(() => go("zen"), [go])
  const handleBack   = useCallback(() => go("settings"), [go])
  const handleComplete = useCallback((r) => { setResults(r); go("results") }, [go])
  const handleRetry  = useCallback(() => go("typing"), [go])

  const cls = `screen${animOut ? " out" : ""}`

  if (screen === "zen") return <ZenScreen settings={settings} onExit={handleBack} />

  return (
    <div className="app">
      <div className={cls}>
        <div className="logo">key<span>flow</span></div>
        {screen === "settings" && (
          <SettingsScreen settings={settings} onChange={changeSetting} onStart={handleStart} onZen={handleZen} />
        )}
        {screen === "typing" && (
          <TypingScreen settings={settings} onComplete={handleComplete} onBack={handleBack} />
        )}
        {screen === "results" && results && (
          <ResultsScreen results={results} onRetry={handleRetry} onBack={handleBack} />
        )}
      </div>
    </div>
  )
}
