// Configurações da API
const OPENROUTER_API_KEY = "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";
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL_NAME = "deepseek/deepseek-chat";

// Variável para armazenar o texto base dos PDFs
let TEXTO_BASE = null;

// Elementos do DOM
const chatMain = document.getElementById('chatMain');
const chatMessages = document.getElementById('chatMessages');
const chatHistory = document.getElementById('chatHistory');
const themeToggle = document.getElementById('themeToggle');
const newChatBtn = document.getElementById('newChatBtn');
const periodicTableBtn = document.getElementById('periodicTableBtn');
const clearHistoryBtn = document.querySelector('.clear-history-btn');
const periodicTableContainer = document.getElementById('periodicTableContainer');
const chatForms = [
    { form: document.getElementById('chatForm'), input: document.getElementById('perguntaInput'), btn: document.getElementById('submitBtn') },
    { form: document.getElementById('chatFormBottom'), input: document.getElementById('perguntaInputBottom'), btn: document.getElementById('submitBtnBottom') }
];

// Configuração do SweetAlert
const SwalConfig = Swal.mixin({
    scrollbarPadding: false,
    heightAuto: false
});

const elements = [
    { number: 1, symbol: "H", name: "Hidrogênio", mass: 1.008, category: "nonmetal", state: "gas", discovery: "1766", electron: "1s¹", description: "O elemento mais leve e abundante no universo." },
    { number: 2, symbol: "He", name: "Hélio", mass: 4.0026, category: "noble-gas", state: "gas", discovery: "1868", electron: "1s²", description: "Gás nobre usado em balões e ressonância magnética." },
    { number: 3, symbol: "Li", name: "Lítio", mass: 6.94, category: "alkali-metal", state: "solid", discovery: "1817", electron: "[He] 2s¹", description: "Metal alcalino leve usado em baterias." },
    { number: 4, symbol: "Be", name: "Berílio", mass: 9.0122, category: "alkaline-earth", state: "solid", discovery: "1798", electron: "[He] 2s²", description: "Metal alcalino-terroso usado em ligas avançadas." },
    { number: 5, symbol: "B", name: "Boro", mass: 10.81, category: "metalloid", state: "solid", discovery: "1808", electron: "[He] 2s² 2p¹", description: "Semimetal usado em fibra de vidro e semicondutores." },
    { number: 6, symbol: "C", name: "Carbono", mass: 12.011, category: "nonmetal", state: "solid", discovery: "Antiguidade", electron: "[He] 2s² 2p²", description: "Base de toda a vida orgânica na Terra." },
    { number: 7, symbol: "N", name: "Nitrogênio", mass: 14.007, category: "nonmetal", state: "gas", discovery: "1772", electron: "[He] 2s² 2p³", description: "Gás que compõe 78% da atmosfera terrestre." },
    { number: 8, symbol: "O", name: "Oxigênio", mass: 15.999, category: "nonmetal", state: "gas", discovery: "1774", electron: "[He] 2s² 2p⁴", description: "Gás essencial para a respiração e combustão." },
    { number: 9, symbol: "F", name: "Flúor", mass: 18.998, category: "halogen", state: "gas", discovery: "1886", electron: "[He] 2s² 2p⁵", description: "O elemento mais eletronegativo, usado em pastas de dente." },
    { number: 10, symbol: "Ne", name: "Neônio", mass: 20.180, category: "noble-gas", state: "gas", discovery: "1898", electron: "[He] 2s² 2p⁶", description: "Gás nobre usado em sinais luminosos." },
    { number: 11, symbol: "Na", name: "Sódio", mass: 22.990, category: "alkali-metal", state: "solid", discovery: "1807", electron: "[Ne] 3s¹", description: "Metal alcalino essencial para a vida animal." },
    { number: 12, symbol: "Mg", name: "Magnésio", mass: 24.305, category: "alkaline-earth", state: "solid", discovery: "1755", electron: "[Ne] 3s²", description: "Metal alcalino-terroso usado em ligas leves." },
    { number: 13, symbol: "Al", name: "Alumínio", mass: 26.982, category: "post-transition-metal", state: "solid", discovery: "1825", electron: "[Ne] 3s² 3p¹", description: "Metal leve amplamente usado em embalagens." },
    { number: 14, symbol: "Si", name: "Silício", mass: 28.085, category: "metalloid", state: "solid", discovery: "1824", electron: "[Ne] 3s² 3p²", description: "Semimetal fundamental para a eletrônica moderna." },
    { number: 15, symbol: "P", name: "Fósforo", mass: 30.974, category: "nonmetal", state: "solid", discovery: "1669", electron: "[Ne] 3s² 3p³", description: "Elemento essencial para o DNA e fertilizantes." },
    { number: 16, symbol: "S", name: "Enxofre", mass: 32.06, category: "nonmetal", state: "solid", discovery: "Antiguidade", electron: "[Ne] 3s² 3p⁴", description: "Usado em pneus, fertilizantes e ácido sulfúrico." },
    { number: 17, symbol: "Cl", name: "Cloro", mass: 35.45, category: "halogen", state: "gas", discovery: "1774", electron: "[Ne] 3s² 3p⁵", description: "Halogenio usado em purificação de água e PVC." },
    { number: 18, symbol: "Ar", name: "Argônio", mass: 39.948, category: "noble-gas", state: "gas", discovery: "1894", electron: "[Ne] 3s² 3p⁶", description: "Gás nobre usado em lâmpadas e soldagem." },
    { number: 19, symbol: "K", name: "Potássio", mass: 39.098, category: "alkali-metal", state: "solid", discovery: "1807", electron: "[Ar] 4s¹", description: "Metal alcalino essencial para a função nervosa." },
    { number: 20, symbol: "Ca", name: "Cálcio", mass: 40.078, category: "alkaline-earth", state: "solid", discovery: "1808", electron: "[Ar] 4s²", description: "Essencial para ossos, dentes e contração muscular." },
    { number: 21, symbol: "Sc", name: "Escândio", mass: 44.956, category: "transition-metal", state: "solid", discovery: "1879", electron: "[Ar] 3d¹ 4s²", description: "Metal de transição usado em luzes de alta intensidade." },
    { number: 22, symbol: "Ti", name: "Titânio", mass: 47.867, category: "transition-metal", state: "solid", discovery: "1791", electron: "[Ar] 3d² 4s²", description: "Metal forte e leve usado em implantes médicos." },
    { number: 23, symbol: "V", name: "Vanádio", mass: 50.942, category: "transition-metal", state: "solid", discovery: "1801", electron: "[Ar] 3d³ 4s²", description: "Usado em ligas de aço de alta resistência." },
    { number: 24, symbol: "Cr", name: "Cromo", mass: 51.996, category: "transition-metal", state: "solid", discovery: "1797", electron: "[Ar] 3d⁵ 4s¹", description: "Usado em cromagem e aço inoxidável." },
    { number: 25, symbol: "Mn", name: "Manganês", mass: 54.938, category: "transition-metal", state: "solid", discovery: "1774", electron: "[Ar] 3d⁵ 4s²", description: "Essencial para produção de aço e enzimas." },
    { number: 26, symbol: "Fe", name: "Ferro", mass: 55.845, category: "transition-metal", state: "solid", discovery: "Antiguidade", electron: "[Ar] 3d⁶ 4s²", description: "Metal essencial para hemoglobina e construção." },
    { number: 27, symbol: "Co", name: "Cobalto", mass: 58.933, category: "transition-metal", state: "solid", discovery: "1735", electron: "[Ar] 3d⁷ 4s²", description: "Usado em baterias recarregáveis e pigmentos." },
    { number: 28, symbol: "Ni", name: "Níquel", mass: 58.693, category: "transition-metal", state: "solid", discovery: "1751", electron: "[Ar] 3d⁸ 4s²", description: "Usado em moedas e aço inoxidável." },
    { number: 29, symbol: "Cu", name: "Cobre", mass: 63.546, category: "transition-metal", state: "solid", discovery: "Antiguidade", electron: "[Ar] 3d¹⁰ 4s¹", description: "Excelente condutor de eletricidade e calor." },
    { number: 30, symbol: "Zn", name: "Zinco", mass: 65.38, category: "transition-metal", state: "solid", discovery: "1746", electron: "[Ar] 3d¹⁰ 4s²", description: "Usado em galvanização e ligas como latão." },
    { number: 31, symbol: "Ga", name: "Gálio", mass: 69.723, category: "post-transition-metal", state: "solid", discovery: "1875", electron: "[Ar] 3d¹⁰ 4s² 4p¹", description: "Derrete na mão (29.8°C), usado em semicondutores." },
    { number: 32, symbol: "Ge", name: "Germânio", mass: 72.630, category: "metalloid", state: "solid", discovery: "1886", electron: "[Ar] 3d¹⁰ 4s² 4p²", description: "Semimetal importante na eletrônica." },
    { number: 33, symbol: "As", name: "Arsênio", mass: 74.922, category: "metalloid", state: "solid", discovery: "1250", electron: "[Ar] 3d¹⁰ 4s² 4p³", description: "Tóxico, mas usado em semicondutores." },
    { number: 34, symbol: "Se", name: "Selênio", mass: 78.971, category: "nonmetal", state: "solid", discovery: "1817", electron: "[Ar] 3d¹⁰ 4s² 4p⁴", description: "Usado em fotocopiadoras e painéis solares." },
    { number: 35, symbol: "Br", name: "Bromo", mass: 79.904, category: "halogen", state: "liquid", discovery: "1826", electron: "[Ar] 3d¹⁰ 4s² 4p⁵", description: "Único halogênio líquido à temperatura ambiente." },
    { number: 36, symbol: "Kr", name: "Criptônio", mass: 83.798, category: "noble-gas", state: "gas", discovery: "1898", electron: "[Ar] 3d¹⁰ 4s² 4p⁶", description: "Gás nobre usado em lâmpadas fluorescentes." },
    { number: 37, symbol: "Rb", name: "Rubídio", mass: 85.468, category: "alkali-metal", state: "solid", discovery: "1861", electron: "[Kr] 5s¹", description: "Metal alcalino usado em relógios atômicos." },
    { number: 38, symbol: "Sr", name: "Estrôncio", mass: 87.62, category: "alkaline-earth", state: "solid", discovery: "1790", electron: "[Kr] 5s²", description: "Usado em fogos de artifício (cor vermelha)." },
    { number: 39, symbol: "Y", name: "Ítrio", mass: 88.906, category: "transition-metal", state: "solid", discovery: "1794", electron: "[Kr] 4d¹ 5s²", description: "Usado em supercondutores e LEDs." },
    { number: 40, symbol: "Zr", name: "Zircônio", mass: 91.224, category: "transition-metal", state: "solid", discovery: "1789", electron: "[Kr] 4d² 5s²", description: "Resistente à corrosão, usado em reatores nucleares." },
    { number: 41, symbol: "Nb", name: "Nióbio", mass: 92.906, category: "transition-metal", state: "solid", discovery: "1801", electron: "[Kr] 4d⁴ 5s¹", description: "Usado em ligas de aço especiais." },
    { number: 42, symbol: "Mo", name: "Molibdênio", mass: 95.95, category: "transition-metal", state: "solid", discovery: "1778", electron: "[Kr] 4d⁵ 5s¹", description: "Essencial para enzimas e ligas resistentes." },
    { number: 43, symbol: "Tc", name: "Tecnécio", mass: 98, category: "transition-metal", state: "solid", discovery: "1937", electron: "[Kr] 4d⁵ 5s²", description: "Primeiro elemento artificialmente produzido." },
    { number: 44, symbol: "Ru", name: "Rutênio", mass: 101.07, category: "transition-metal", state: "solid", discovery: "1844", electron: "[Kr] 4d⁷ 5s¹", description: "Usado em catalisadores e ligas resistentes." },
    { number: 45, symbol: "Rh", name: "Ródio", mass: 102.91, category: "transition-metal", state: "solid", discovery: "1803", electron: "[Kr] 4d⁸ 5s¹", description: "Metal precioso usado em conversores catalíticos." },
    { number: 46, symbol: "Pd", name: "Paládio", mass: 106.42, category: "transition-metal", state: "solid", discovery: "1803", electron: "[Kr] 4d¹⁰", description: "Usado em catalisadores e joalheria." },
    { number: 47, symbol: "Ag", name: "Prata", mass: 107.87, category: "transition-metal", state: "solid", discovery: "Antiguidade", electron: "[Kr] 4d¹⁰ 5s¹", description: "Excelente condutor térmico e elétrico." },
    { number: 48, symbol: "Cd", name: "Cádmio", mass: 112.41, category: "transition-metal", state: "solid", discovery: "1817", electron: "[Kr] 4d¹⁰ 5s²", description: "Usado em baterias níquel-cádmio (tóxico)." },
    { number: 49, symbol: "In", name: "Índio", mass: 114.82, category: "post-transition-metal", state: "solid", discovery: "1863", electron: "[Kr] 4d¹⁰ 5s² 5p¹", description: "Usado em telas touchscreen e LEDs." },
    { number: 50, symbol: "Sn", name: "Estanho", mass: 118.71, category: "post-transition-metal", state: "solid", discovery: "Antiguidade", electron: "[Kr] 4d¹⁰ 5s² 5p²", description: "Usado em soldas e latas de conserva." },
    { number: 51, symbol: "Sb", name: "Antimônio", mass: 121.76, category: "metalloid", state: "solid", discovery: "Antiguidade", electron: "[Kr] 4d¹⁰ 5s² 5p³", description: "Usado em retardantes de chama e ligas." },
    { number: 52, symbol: "Te", name: "Telúrio", mass: 127.60, category: "metalloid", state: "solid", discovery: "1782", electron: "[Kr] 4d¹⁰ 5s² 5p⁴", description: "Usado em painéis solares e ligas." },
    { number: 53, symbol: "I", name: "Iodo", mass: 126.90, category: "halogen", state: "solid", discovery: "1811", electron: "[Kr] 4d¹⁰ 5s² 5p⁵", description: "Essencial para a tireoide, usado em desinfetantes." },
    { number: 54, symbol: "Xe", name: "Xenônio", mass: 131.29, category: "noble-gas", state: "gas", discovery: "1898", electron: "[Kr] 4d¹⁰ 5s² 5p⁶", description: "Usado em lâmpadas e anestésicos." },
    { number: 55, symbol: "Cs", name: "Césio", mass: 132.91, category: "alkali-metal", state: "solid", discovery: "1860", electron: "[Xe] 6s¹", description: "Usado em relógios atômicos (precisão extrema)." },
    { number: 56, symbol: "Ba", name: "Bário", mass: 137.33, category: "alkaline-earth", state: "solid", discovery: "1808", electron: "[Xe] 6s²", description: "Usado em contrastes para raio-X." },
    { number: 57, symbol: "La", name: "Lantânio", mass: 138.91, category: "lanthanide", state: "solid", discovery: "1839", electron: "[Xe] 5d¹ 6s²", description: "Primeiro dos lantanídeos, usado em baterias." },
    { number: 58, symbol: "Ce", name: "Cério", mass: 140.12, category: "lanthanide", state: "solid", discovery: "1803", electron: "[Xe] 4f¹ 5d¹ 6s²", description: "Usado em catalisadores e ligas." },
    { number: 59, symbol: "Pr", name: "Praseodímio", mass: 140.91, category: "lanthanide", state: "solid", discovery: "1885", electron: "[Xe] 4f³ 6s²", description: "Usado em ligas e vidros especiais." },
    { number: 60, symbol: "Nd", name: "Neodímio", mass: 144.24, category: "lanthanide", state: "solid", discovery: "1885", electron: "[Xe] 4f⁴ 6s²", description: "Usado em ímãs poderosos." },
    { number: 61, symbol: "Pm", name: "Promécio", mass: 145, category: "lanthanide", state: "solid", discovery: "1945", electron: "[Xe] 4f⁵ 6s²", description: "Elemento radioativo artificial." },
    { number: 62, symbol: "Sm", name: "Samário", mass: 150.36, category: "lanthanide", state: "solid", discovery: "1879", electron: "[Xe] 4f⁶ 6s²", description: "Usado em ímãs e tratamento de câncer." },
    { number: 63, symbol: "Eu", name: "Európio", mass: 151.96, category: "lanthanide", state: "solid", discovery: "1901", electron: "[Xe] 4f⁷ 6s²", description: "Usado em telas de TV e cédulas de euro." },
    { number: 64, symbol: "Gd", name: "Gadolínio", mass: 157.25, category: "lanthanide", state: "solid", discovery: "1880", electron: "[Xe] 4f⁷ 5d¹ 6s²", description: "Usado em ressonância magnética." },
    { number: 65, symbol: "Tb", name: "Térbio", mass: 158.93, category: "lanthanide", state: "solid", discovery: "1843", electron: "[Xe] 4f⁹ 6s²", description: "Usado em dispositivos de armazenamento." },
    { number: 66, symbol: "Dy", name: "Disprósio", mass: 162.50, category: "lanthanide", state: "solid", discovery: "1886", electron: "[Xe] 4f¹⁰ 6s²", description: "Usado em ímãs e reatores nucleares." },
    { number: 67, symbol: "Ho", name: "Hólmio", mass: 164.93, category: "lanthanide", state: "solid", discovery: "1878", electron: "[Xe] 4f¹¹ 6s²", description: "Tem as propriedades magnéticas mais fortes." },
    { number: 68, symbol: "Er", name: "Érbio", mass: 167.26, category: "lanthanide", state: "solid", discovery: "1843", electron: "[Xe] 4f¹² 6s²", description: "Usado em fibras ópticas e lasers." },
    { number: 69, symbol: "Tm", name: "Túlio", mass: 168.93, category: "lanthanide", state: "solid", discovery: "1879", electron: "[Xe] 4f¹³ 6s²", description: "O mais raro dos lantanídeos naturais." },
    { number: 70, symbol: "Yb", name: "Itérbio", mass: 173.05, category: "lanthanide", state: "solid", discovery: "1878", electron: "[Xe] 4f¹⁴ 6s²", description: "Usado em relógios atômicos e aços." },
    { number: 71, symbol: "Lu", name: "Lutécio", mass: 174.97, category: "lanthanide", state: "solid", discovery: "1907", electron: "[Xe] 4f¹⁴ 5d¹ 6s²", description: "Último dos lantanídeos, usado em catálise." },
    { number: 72, symbol: "Hf", name: "Háfnio", mass: 178.49, category: "transition-metal", state: "solid", discovery: "1923", electron: "[Xe] 4f¹⁴ 5d² 6s²", description: "Usado em barras de controle nuclear." },
    { number: 73, symbol: "Ta", name: "Tântalo", mass: 180.95, category: "transition-metal", state: "solid", discovery: "1802", electron: "[Xe] 4f¹⁴ 5d³ 6s²", description: "Resistente à corrosão, usado em eletrônicos." },
    { number: 74, symbol: "W", name: "Tungstênio", mass: 183.84, category: "transition-metal", state: "solid", discovery: "1783", electron: "[Xe] 4f¹⁴ 5d⁴ 6s²", description: "Maior ponto de fusão de todos os metais." },
    { number: 75, symbol: "Re", name: "Rênio", mass: 186.21, category: "transition-metal", state: "solid", discovery: "1925", electron: "[Xe] 4f¹⁴ 5d⁵ 6s²", description: "Um dos elementos mais raros na crosta terrestre." },
    { number: 76, symbol: "Os", name: "Ósmio", mass: 190.23, category: "transition-metal", state: "solid", discovery: "1803", electron: "[Xe] 4f¹⁴ 5d⁶ 6s²", description: "Substância natural mais densa conhecida." },
    { number: 77, symbol: "Ir", name: "Irídio", mass: 192.22, category: "transition-metal", state: "solid", discovery: "1803", electron: "[Xe] 4f¹⁴ 5d⁷ 6s²", description: "Um dos elementos mais resistentes à corrosão." },
    { number: 78, symbol: "Pt", name: "Platina", mass: 195.08, category: "transition-metal", state: "solid", discovery: "1735", electron: "[Xe] 4f¹⁴ 5d⁹ 6s¹", description: "Metal precioso usado em catalisadores e joias." },
    { number: 79, symbol: "Au", name: "Ouro", mass: 196.97, category: "transition-metal", state: "solid", discovery: "Antiguidade", electron: "[Xe] 4f¹⁴ 5d¹⁰ 6s¹", description: "Metal precioso usado em joias e eletrônicos." },
    { number: 80, symbol: "Hg", name: "Mercúrio", mass: 200.59, category: "transition-metal", state: "liquid", discovery: "Antiguidade", electron: "[Xe] 4f¹⁴ 5d¹⁰ 6s²", description: "Único metal líquido à temperatura ambiente." },
    { number: 81, symbol: "Tl", name: "Tálio", mass: 204.38, category: "post-transition-metal", state: "solid", discovery: "1861", electron: "[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p¹", description: "Extremamente tóxico, usado em detectores infravermelhos." },
    { number: 82, symbol: "Pb", name: "Chumbo", mass: 207.2, category: "post-transition-metal", state: "solid", discovery: "Antiguidade", electron: "[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p²", description: "Usado em baterias, mas tóxico para humanos." },
    { number: 83, symbol: "Bi", name: "Bismuto", mass: 208.98, category: "post-transition-metal", state: "solid", discovery: "1753", electron: "[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p³", description: "O mais diamagnético de todos os metais." },
    { number: 84, symbol: "Po", name: "Polônio", mass: 209, category: "post-transition-metal", state: "solid", discovery: "1898", electron: "[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁴", description: "Elemento altamente radioativo." },
    { number: 85, symbol: "At", name: "Astato", mass: 210, category: "halogen", state: "solid", discovery: "1940", electron: "[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁵", description: "O halogênio mais raro e radioativo." },
    { number: 86, symbol: "Rn", name: "Radônio", mass: 222, category: "noble-gas", state: "gas", discovery: "1900", electron: "[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁶", description: "Gás nobre radioativo, perigoso para a saúde." },
    { number: 87, symbol: "Fr", name: "Frâncio", mass: 223, category: "alkali-metal", state: "solid", discovery: "1939", electron: "[Rn] 7s¹", description: "O metal alcalino mais instável e radioativo." },
    { number: 88, symbol: "Ra", name: "Rádio", mass: 226, category: "alkaline-earth", state: "solid", discovery: "1898", electron: "[Rn] 7s²", description: "Famoso por sua radioatividade, usado antigamente em tintas." },
    { number: 89, symbol: "Ac", name: "Actínio", mass: 227, category: "actinide", state: "solid", discovery: "1899", electron: "[Rn] 6d¹ 7s²", description: "Elemento radioativo que dá nome à série dos actinídeos." },
    { number: 90, symbol: "Th", name: "Tório", mass: 232.04, category: "actinide", state: "solid", discovery: "1829", electron: "[Rn] 6d² 7s²", description: "Usado como combustível nuclear em reatores." },
    { number: 91, symbol: "Pa", name: "Protactínio", mass: 231.04, category: "actinide", state: "solid", discovery: "1913", electron: "[Rn] 5f² 6d¹ 7s²", description: "Um dos elementos mais raros e caros." },
    { number: 92, symbol: "U", name: "Urânio", mass: 238.03, category: "actinide", state: "solid", discovery: "1789", electron: "[Rn] 5f³ 6d¹ 7s²", description: "Combustível principal para energia nuclear." },
    { number: 93, symbol: "Np", name: "Netúnio", mass: 237, category: "actinide", state: "solid", discovery: "1940", electron: "[Rn] 5f⁴ 6d¹ 7s²", description: "Primeiro elemento transurânico sintetizado." },
    { number: 94, symbol: "Pu", name: "Plutônio", mass: 244, category: "actinide", state: "solid", discovery: "1940", electron: "[Rn] 5f⁶ 7s²", description: "Usado em armas nucleares e como combustível." },
    { number: 95, symbol: "Am", name: "Amerício", mass: 243, category: "actinide", state: "solid", discovery: "1944", electron: "[Rn] 5f⁷ 7s²", description: "Usado em detectores de fumaça." },
    { number: 96, symbol: "Cm", name: "Cúrio", mass: 247, category: "actinide", state: "solid", discovery: "1944", electron: "[Rn] 5f⁷ 6d¹ 7s²", description: "Homenagem a Marie e Pierre Curie." },
    { number: 97, symbol: "Bk", name: "Berquélio", mass: 247, category: "actinide", state: "solid", discovery: "1949", electron: "[Rn] 5f⁹ 7s²", description: "Produzido em quantidades mínimas para pesquisa." },
    { number: 98, symbol: "Cf", name: "Califórnio", mass: 251, category: "actinide", state: "solid", discovery: "1950", electron: "[Rn] 5f¹⁰ 7s²", description: "Um dos elementos mais caros, usado em medicina nuclear." },
    { number: 99, symbol: "Es", name: "Einstênio", mass: 252, category: "actinide", state: "solid", discovery: "1952", electron: "[Rn] 5f¹¹ 7s²", description: "Homenagem a Albert Einstein." },
    { number: 100, symbol: "Fm", name: "Férmio", mass: 257, category: "actinide", state: "solid", discovery: "1952", electron: "[Rn] 5f¹² 7s²", description: "Homenagem a Enrico Fermi." },
    { number: 101, symbol: "Md", name: "Mendelévio", mass: 258, category: "actinide", state: "solid", discovery: "1955", electron: "[Rn] 5f¹³ 7s²", description: "Homenagem a Dmitri Mendeleev, criador da tabela periódica." },
    { number: 102, symbol: "No", name: "Nobélio", mass: 259, category: "actinide", state: "solid", discovery: "1958", electron: "[Rn] 5f¹⁴ 7s²", description: "Homenagem a Alfred Nobel." },
    { number: 103, symbol: "Lr", name: "Laurêncio", mass: 262, category: "actinide", state: "solid", discovery: "1961", electron: "[Rn] 5f¹⁴ 7s² 7p¹", description: "Homenagem a Ernest Lawrence, inventor do ciclotron." },
    { number: 104, symbol: "Rf", name: "Rutherfórdio", mass: 267, category: "transition-metal", state: "solid", discovery: "1964", electron: "[Rn] 5f¹⁴ 6d² 7s²", description: "Homenagem a Ernest Rutherford." },
    { number: 105, symbol: "Db", name: "Dúbnio", mass: 268, category: "transition-metal", state: "solid", discovery: "1967", electron: "[Rn] 5f¹⁴ 6d³ 7s²", description: "Homenagem ao Instituto Conjunto de Pesquisa Nuclear em Dubna, Rússia." },
    { number: 106, symbol: "Sg", name: "Seabórgio", mass: 269, category: "transition-metal", state: "solid", discovery: "1974", electron: "[Rn] 5f¹⁴ 6d⁴ 7s²", description: "Homenagem a Glenn T. Seaborg." },
    { number: 107, symbol: "Bh", name: "Bóhrio", mass: 270, category: "transition-metal", state: "solid", discovery: "1981", electron: "[Rn] 5f¹⁴ 6d⁵ 7s²", description: "Homenagem a Niels Bohr." },
    { number: 108, symbol: "Hs", name: "Hássio", mass: 269, category: "transition-metal", state: "solid", discovery: "1984", electron: "[Rn] 5f¹⁴ 6d⁶ 7s²", description: "Homenagem ao estado alemão de Hesse." },
    { number: 109, symbol: "Mt", name: "Meitnério", mass: 278, category: "transition-metal", state: "solid", discovery: "1982", electron: "[Rn] 5f¹⁴ 6d⁷ 7s²", description: "Homenagem a Lise Meitner." },
    { number: 110, symbol: "Ds", name: "Darmstádio", mass: 281, category: "transition-metal", state: "solid", discovery: "1994", electron: "[Rn] 5f¹⁴ 6d⁹ 7s¹", description: "Homenagem à cidade de Darmstadt, Alemanha." },
    { number: 111, symbol: "Rg", name: "Roentgênio", mass: 282, category: "transition-metal", state: "solid", discovery: "1994", electron: "[Rn] 5f¹⁴ 6d¹⁰ 7s¹", description: "Homenagem a Wilhelm Röntgen, descobridor dos raios X." },
    { number: 112, symbol: "Cn", name: "Copernício", mass: 285, category: "transition-metal", state: "liquid", discovery: "1996", electron: "[Rn] 5f¹⁴ 6d¹⁰ 7s²", description: "Homenagem a Nicolau Copérnico." },
    { number: 113, symbol: "Nh", name: "Nihônio", mass: 286, category: "post-transition-metal", state: "solid", discovery: "2004", electron: "[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p¹", description: "Do japonês 'Nihon' (Japão), primeiro elemento descoberto na Ásia." },
    { number: 114, symbol: "Fl", name: "Fleróvio", mass: 289, category: "post-transition-metal", state: "liquid", discovery: "1999", electron: "[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p²", description: "Homenagem a Georgy Flyorov, físico nuclear." },
    { number: 115, symbol: "Mc", name: "Moscóvio", mass: 290, category: "post-transition-metal", state: "solid", discovery: "2004", electron: "[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p³", description: "Homenagem à região de Moscou." },
    { number: 116, symbol: "Lv", name: "Livermório", mass: 293, category: "post-transition-metal", state: "solid", discovery: "2000", electron: "[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁴", description: "Homenagem ao Laboratório Nacional Lawrence Livermore." },
    { number: 117, symbol: "Ts", name: "Tenesso", mass: 294, category: "halogen", state: "solid", discovery: "2010", electron: "[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁵", description: "Homenagem ao estado do Tennessee, EUA." },
    { number: 118, symbol: "Og", name: "Oganessônio", mass: 294, category: "noble-gas", state: "gas", discovery: "2006", electron: "[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁶", description: "Homenagem a Yuri Oganessian, físico nuclear." }
];

// Posições na tabela periódica (número atômico: [linha, coluna])
// Posições na tabela periódica (número atômico: [linha, coluna])
const positions = {
    // Período 1
    1: [1, 2], 2: [1, 19],
    
    // Período 2
    3: [2, 2], 4: [2, 3],
    5: [2, 14], 6: [2, 15], 7: [2, 16], 8: [2, 17], 9: [2, 18], 10: [2, 19],
    
    // Período 3
    11: [3, 2], 12: [3, 3],
    13: [3, 14], 14: [3, 15], 15: [3, 16], 16: [3, 17], 17: [3, 18], 18: [3, 19],
    
    // Período 4
    19: [4, 2], 20: [4, 3],
    21: [4, 4], 22: [4, 5], 23: [4, 6], 24: [4, 7], 25: [4, 8], 26: [4, 9], 
    27: [4, 10], 28: [4, 11], 29: [4, 12], 30: [4, 13],
    31: [4, 14], 32: [4, 15], 33: [4, 16], 34: [4, 17], 35: [4, 18], 36: [4, 19],
    
    // Período 5
    37: [5, 2], 38: [5, 3],
    39: [5, 4], 40: [5, 5], 41: [5, 6], 42: [5, 7], 43: [5, 8], 44: [5, 9],
    45: [5, 10], 46: [5, 11], 47: [5, 12], 48: [5, 13],
    49: [5, 14], 50: [5, 15], 51: [5, 16], 52: [5, 17], 53: [5, 18], 54: [5, 19],
    
    // Período 6
    55: [6, 2], 56: [6, 3],
    72: [6, 5], 73: [6, 6], 74: [6, 7], 75: [6, 8], 76: [6, 9], 77: [6, 10],
    78: [6, 11], 79: [6, 12], 80: [6, 13],
    81: [6, 14], 82: [6, 15], 83: [6, 16], 84: [6, 17], 85: [6, 18], 86: [6, 19],
    
    // Período 7
    87: [7, 2], 88: [7, 3],
    104: [7, 5], 105: [7, 6], 106: [7, 7], 107: [7, 8], 108: [7, 9], 109: [7, 10],
    110: [7, 11], 111: [7, 12], 112: [7, 13],
    113: [7, 14], 114: [7, 15], 115: [7, 16], 116: [7, 17], 117: [7, 18], 118: [7, 19]
};

// Lantanídeos e actinídeos (incluindo La e Ac)
const lanthanides = [57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71];
const actinides = [89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103];

async function loadPeriodicTableData() {
    return Promise.resolve();
}

// Função para criar a tabela periódica principal
function createPeriodicTable() {
    const table = document.getElementById('periodic-table');
    
    // Limpa a tabela
    table.innerHTML = '';
    
    // Adiciona números dos períodos (linhas)
    for (let row = 1; row <= 7; row++) {
        const periodNumber = document.createElement('div');
        periodNumber.className = 'period-number';
        periodNumber.style.gridColumn = '1';
        periodNumber.style.gridRow = (row + 1).toString();
        periodNumber.textContent = row;
        table.appendChild(periodNumber);
    }
    
    // Adiciona números dos grupos (colunas)
    for (let col = 1; col <= 18; col++) {
        const groupNumber = document.createElement('div');
        groupNumber.className = 'group-number';
        groupNumber.style.gridColumn = (col + 1).toString();
        groupNumber.style.gridRow = '1';
        groupNumber.textContent = col;
        table.appendChild(groupNumber);
    }
    
    // Cria células vazias para a estrutura da tabela
    for (let row = 2; row <= 8; row++) {
        for (let col = 2; col <= 19; col++) {
            const cell = document.createElement('div');
            cell.className = 'empty-cell';
            cell.style.gridRow = row.toString();
            cell.style.gridColumn = col.toString();
            table.appendChild(cell);
        }
    }
    
    // Placeholders para lantanídeos e actinídeos
    const lanthanidePlaceholder = document.createElement('div');
    lanthanidePlaceholder.className = 'series-placeholder';
    lanthanidePlaceholder.style.gridRow = '7';
    lanthanidePlaceholder.style.gridColumn = '4';
    lanthanidePlaceholder.innerHTML = 'Lantanídeos<br>57-71';
    table.appendChild(lanthanidePlaceholder);

    const actinidePlaceholder = document.createElement('div');
    actinidePlaceholder.className = 'series-placeholder';
    actinidePlaceholder.style.gridRow = '8';
    actinidePlaceholder.style.gridColumn = '4';
    actinidePlaceholder.innerHTML = 'Actinídeos<br>89-103';
    table.appendChild(actinidePlaceholder);
    
    // Adiciona os elementos nas posições corretas
    elements.forEach(element => {
        if (positions[element.number]) {
            const [row, col] = positions[element.number];
            const elementDiv = createElementDiv(element, row + 1, col); // +1 porque a primeira linha é para os números dos grupos
            table.appendChild(elementDiv);
        }
    });
}

// Função para criar a série dos lantanídeos e actinídeos
function createLanthanidesActinides() {
    const container = document.getElementById('lanthanides-actinides');
    container.innerHTML = '';
    
    // Adiciona lantanídeos (incluindo La)
    lanthanides.forEach((num, index) => {
        const element = elements.find(e => e.number === num);
        if (element) {
            const elementDiv = createElementDiv(element, 1, index + 1);
            container.appendChild(elementDiv);
        }
    });
    
    // Adiciona actinídeos (incluindo Ac)
    actinides.forEach((num, index) => {
        const element = elements.find(e => e.number === num);
        if (element) {
            const elementDiv = createElementDiv(element, 2, index + 1);
            container.appendChild(elementDiv);
        }
    });
}

// Função auxiliar para criar um elemento div
function createElementDiv(element, row, col) {
    const elementDiv = document.createElement('div');
    elementDiv.className = `element ${element.category} ${element.state}`;
    elementDiv.style.gridRow = row;
    elementDiv.style.gridColumn = col;
    
    elementDiv.innerHTML = `
        <span class="number">${element.number}</span>
        <span class="symbol">${element.symbol}</span>
        <span class="name">${element.name}</span>
    `;
    
    elementDiv.addEventListener('mouseenter', (e) => showElementDetails(element, e));
    elementDiv.addEventListener('mouseleave', hideElementDetails);
    
    return elementDiv;
}

// Função para mostrar os detalhes do elemento
function showElementDetails(element, event) {
    const details = document.getElementById('element-details');
    document.getElementById('detail-title').textContent = `${element.name} (${element.symbol})`;
    document.getElementById('detail-number').textContent = element.number;
    document.getElementById('detail-symbol').textContent = element.symbol;
    document.getElementById('detail-name').textContent = element.name;
    document.getElementById('detail-mass').textContent = element.mass;
    document.getElementById('detail-category').textContent = getCategoryName(element.category);
    document.getElementById('detail-state').textContent = getStateName(element.state);
    document.getElementById('detail-discovery').textContent = element.discovery;
    document.getElementById('detail-electron').textContent = element.electron;
    document.getElementById('detail-description').textContent = element.description;
    
    // Posiciona o detalhe ao lado do elemento
    const elementRect = event.target.getBoundingClientRect();
    details.style.left = `${elementRect.right + 10}px`;
    details.style.top = `${elementRect.top}px`;
    
    details.style.display = 'block';
}

function hideElementDetails() {
    document.getElementById('element-details').style.display = 'none';
}

// Funções auxiliares para traduzir categorias e estados
function getCategoryName(category) {
    const categories = {
        'alkali-metal': 'Metal Alcalino',
        'alkaline-earth': 'Metal Alcalino-Terroso',
        'transition-metal': 'Metal de Transição',
        'post-transition-metal': 'Metal Pós-Transição',
        'metalloid': 'Semimetal',
        'nonmetal': 'Não Metal',
        'halogen': 'Halogênio',
        'noble-gas': 'Gás Nobre',
        'lanthanide': 'Lantanídeo',
        'actinide': 'Actinídeo',
        'unknown': 'Desconhecido'
    };
    return categories[category] || category;
}

function getStateName(state) {
    const states = {
        'gas': 'Gasoso',
        'solid': 'Sólido',
        'liquid': 'Líquido',
        'unknown': 'Desconhecido'
    };
    return states[state] || state;
}

// Alternar entre chat e tabela periódica
function togglePeriodicTable() {
    const isTableVisible = periodicTableContainer.style.display === 'block';
    
    if (isTableVisible) {
        periodicTableContainer.style.display = 'none';
        document.querySelector('.chat-messages-container').style.display = 'flex';
        document.querySelector('.normal-position').style.display = 'block';
        document.querySelector('.chat-main-initial').style.display = 'flex';
    } else {
        periodicTableContainer.style.display = 'block';
        document.querySelector('.chat-messages-container').style.display = 'none';
        document.querySelector('.normal-position').style.display = 'none';
        document.querySelector('.chat-main-initial').style.display = 'none';
        
        // Cria as tabelas se ainda não foram criadas
        if (!document.getElementById('periodic-table').hasChildNodes()) {
            createPeriodicTable();
            createLanthanidesActinides();
        }
    }
}

// Carrega o texto base dos PDFs (simulado)
async function carregarBaseConhecimento() {
    if (TEXTO_BASE === null) {
        try {
            // Simulação de carregamento de PDFs
            // Em um projeto real, você precisaria implementar o carregamento real dos PDFs
            // ou pré-processá-los e incluí-los como um arquivo JSON ou texto
            TEXTO_BASE = `
                Tabela Periódica: A tabela periódica é um arranjo dos elementos químicos em ordem crescente de número atômico, organizados por suas propriedades periódicas. Ela é dividida em grupos (colunas) e períodos (linhas). Os elementos são classificados como metais, não-metais e semimetais, com propriedades periódicas como raio atômico, energia de ionização, afinidade eletrônica e eletronegatividade variando de forma previsível ao longo da tabela.

                Propriedades dos Elementos: Cada elemento possui propriedades características como ponto de fusão, ponto de ebulição, densidade, estados de oxidação e configuração eletrônica. Por exemplo, o Oxigênio (O) é um não-metal altamente reativo, essencial para a respiração e combustão, com número atômico 8 e configuração eletrônica 1s² 2s² 2p⁴.

                Ligação Química: Os átomos se ligam para formar moléculas através de ligações iônicas (transferência de elétrons), covalentes (compartilhamento de elétrons) ou metálicas (nuvem de elétrons). A natureza da ligação depende da diferença de eletronegatividade entre os átomos.

                Configuração Eletrônica: A distribuição dos elétrons em níveis e subníveis de energia segue o princípio de Aufbau, a regra de Hund e o princípio de exclusão de Pauli. Por exemplo, o Ferro (Fe) tem número atômico 26 e configuração eletrônica 1s² 2s² 2p⁶ 3s² 3p⁶ 4s² 3d⁶.
            `;
        } catch (error) {
            console.error("Erro ao carregar base de conhecimento:", error);
            TEXTO_BASE = "Base de conhecimento vazia.";
        }
    }
    return TEXTO_BASE;
}

// Busca contexto relevante na base de conhecimento
async function buscarContexto(pergunta) {
    const textoBase = await carregarBaseConhecimento();
    if (!textoBase || textoBase === "Base de conhecimento vazia.") {
        return "Informações de referência não disponíveis.";
    }
    
    const perguntaLimpa = pergunta.toLowerCase().trim();
    const palavrasChave = perguntaLimpa.split(/\s+/).filter(p => p.length > 3 && /^[a-záéíóúâêôãõç]+$/i.test(p));
    
    if (!palavrasChave.length) {
        return "Nenhuma palavra-chave relevante encontrada na pergunta.";
    }
    
    const linhasRelevantes = [];
    for (const linha of textoBase.split('\n')) {
        const linhaLimpa = linha.trim();
        if (linhaLimpa && palavrasChave.some(palavra => linhaLimpa.toLowerCase().includes(palavra))) {
            linhasRelevantes.push(linhaLimpa);
            if (linhasRelevantes.length >= 50) break;
        }
    }
    
    return linhasRelevantes.length ? linhasRelevantes.join("\n") : "Nenhum contexto específico encontrado.";
}

// Limpa o texto de formatação indesejada
function limparTextoDefinitivo(texto) {
    if (!texto) return texto;
    
    texto = texto
        .replace(/^[\s\u200B-\u200D\uFEFF]+|[\s\u200B-\u200D\uFEFF]+$/g, '')
        .replace(/[ \t]+/g, ' ');
    
    const linhas = texto.split('\n').map(linha => linha.trim()).filter(linha => linha);
    return linhas.join('\n').trim();
}

// Atualiza o estado do botão de envio
function updateSendButtonState() {
    chatForms.forEach(({ input, btn }) => {
        btn.disabled = !input.value.trim();
    });
}

// Renderiza markdown com estilos personalizados
function renderMarkdown(text, isUserMessage = false) {
    if (!text) return '';
    
    let cleanedText = text
        .replace(/^[\s\u200B-\u200D\uFEFF]+/, '')
        .replace(/[\s\u200B-\u200D\uFEFF]+$/, '')
        .replace(/[ \t]+/g, ' ')
        .replace(/\n\s+/g, '\n');
    
    if (isUserMessage) {
        return cleanedText.replace(/\n/g, '<br>');
    }
    
    const paragraphs = cleanedText.split('\n\n');
    let firstParagraph = paragraphs[0].trim();
    let restOfText = paragraphs.slice(1).join('\n\n');
    let renderedRest = marked.parse(restOfText || '');
    
    let result = `<p class="md-paragraph">${firstParagraph}</p>`;
    if (renderedRest.trim().length > 0) {
        result += renderedRest;
    }
    
    return result
        .replace(/<ul>/g, '<ul class="md-list">')
        .replace(/<ol>/g, '<ol class="md-list">')
        .replace(/<li>/g, '<li class="md-list-item">')
        .replace(/<code>/g, '<code class="md-code">')
        .replace(/<pre>/g, '<pre class="md-pre">')
        .replace(/<blockquote>/g, '<blockquote class="md-quote">')
        .replace(/<h1>/g, '<h1 class="md-heading h1">')
        .replace(/<h2>/g, '<h2 class="md-heading h2">')
        .replace(/<h3>/g, '<h3 class="md-heading h3">')
        .replace(/<strong>/g, '<strong class="md-strong">')
        .replace(/<em>/g, '<em class="md-em">')
        .replace(/<a /g, '<a class="md-link" ');
}

// Adiciona mensagem ao chat
function addMessage(text, isUser) {
    const messageContainer = document.createElement('div');
    messageContainer.className = `message-container ${isUser ? 'user-message-container' : 'bot-message-container'}`;
    
    if (!isUser) {
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'message-avatar bot-message-avatar';
        avatarDiv.innerHTML = '<div class="avatar-circle"><i class="fas fa-robot"></i></div>';
        messageContainer.appendChild(avatarDiv);
    }
    
    const messageContent = document.createElement('div');
    messageContent.className = `message-content ${isUser ? 'user-message-content' : 'bot-message-content'}`;
    messageContent.innerHTML = renderMarkdown(text, isUser);
    
    messageContainer.appendChild(messageContent);
    chatMessages.appendChild(messageContainer);
    
    setTimeout(() => {
        messageContainer.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 50);
}

// Mostra indicador de carregamento
function showLoadingIndicator() {
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'loading-message';
    loadingDiv.innerHTML = `
        <div class="loading-avatar">
            <i class="fas fa-robot"></i>
        </div>
        <div class="loading-content">
            <div class="loading-spinner"></div>
            <div class="loading-text">Pensando...</div>
        </div>
    `;
    
    chatMessages.appendChild(loadingDiv);
    loadingDiv.scrollIntoView({ behavior: 'smooth', block: 'end' });
    
    return loadingDiv;
}

// Remove indicador de carregamento
function hideLoadingIndicator(loadingElement) {
    if (loadingElement && loadingElement.parentNode) {
        loadingElement.parentNode.removeChild(loadingElement);
    }
}

// Cria título para o chat baseado na primeira mensagem
function criarTituloChat(pergunta) {
    const palavras = pergunta.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
        .split(' ')
        .filter(palavra => palavra.length > 3);
    
    return palavras.slice(0, 5).join(' ') || "Conversa sobre química";
}

// Atualiza a barra lateral com o novo chat
function updateSidebar(chatId, firstMessage) {
    document.querySelectorAll('#chatHistory li').forEach(item => {
        item.classList.remove('active');
    });
    
    const emptyHistory = chatHistory.querySelector('.empty-history');
    if (emptyHistory) {
        emptyHistory.remove();
    }
    
    const existingChat = chatHistory.querySelector(`.chat-link[data-chat-id="${chatId}"]`);
    if (existingChat) {
        existingChat.closest('li').classList.add('active');
        return;
    }
    
    const chatTitle = criarTituloChat(firstMessage);
    
    const newChatItem = document.createElement('li');
    newChatItem.className = 'active';
    newChatItem.innerHTML = `
        <div class="chat-item">
            <i class="fas fa-comment-dots chat-icon"></i>
            <span class="chat-link" data-chat-id="${chatId}" title="${chatTitle}">
                ${chatTitle}
            </span>
            <div class="chat-actions">
                <button class="chat-action-btn delete" data-chat-id="${chatId}" title="Deletar chat">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
    `;
    
    chatHistory.insertBefore(newChatItem, chatHistory.firstChild);
    
    setupChatItemEvents(newChatItem);
    
    saveChatToLocalStorage(chatId, chatTitle, firstMessage);
}

// Salva chat no localStorage
function saveChatToLocalStorage(chatId, title, firstMessage) {
    let chats = JSON.parse(localStorage.getItem('chatHistory')) || {};
    chats[chatId] = {
        titulo: title,
        primeiraMensagem: firstMessage,
        timestamp: Date.now(),
        messages: Array.from(chatMessages.children).map(el => {
            const isUser = el.classList.contains('user-message-container');
            const content = el.querySelector('.message-content').textContent;
            return { isUser, content };
        })
    };
    localStorage.setItem('chatHistory', JSON.stringify(chats));
}

// Carrega chats do localStorage
function loadChatsFromLocalStorage() {
    const chats = JSON.parse(localStorage.getItem('chatHistory')) || {};
    
    const emptyHistory = chatHistory.querySelector('.empty-history');
    if (emptyHistory && Object.keys(chats).length > 0) {
        emptyHistory.remove();
    }
    
    if (Object.keys(chats).length === 0) {
        if (!emptyHistory) {
            const emptyItem = document.createElement('li');
            emptyItem.className = 'empty-history';
            emptyItem.innerHTML = `
                <i class="fas fa-inbox"></i>
                <span>Nenhum histórico disponível</span>
            `;
            chatHistory.appendChild(emptyItem);
        }
        return;
    }
    
    const sortedChats = Object.entries(chats).sort((a, b) => b[1].timestamp - a[1].timestamp);
    
    sortedChats.forEach(([chatId, chatData]) => {
        const chatItem = document.createElement('li');
        chatItem.className = localStorage.getItem('currentChatId') === chatId ? 'active' : '';
        chatItem.innerHTML = `
            <div class="chat-item">
                <i class="fas fa-comment-dots chat-icon"></i>
                <span class="chat-link" data-chat-id="${chatId}" title="${chatData.titulo}">
                    ${chatData.titulo}
                </span>
                <div class="chat-actions">
                    <button class="chat-action-btn delete" data-chat-id="${chatId}" title="Deletar chat">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        `;
        
        chatHistory.appendChild(chatItem);
        setupChatItemEvents(chatItem);
    });
}

// Configura eventos para os itens do chat na barra lateral
function setupChatItemEvents(chatItem) {
    const chatLink = chatItem.querySelector('.chat-link');
    chatLink.addEventListener('click', function(e) {
        e.stopPropagation();
        const chatId = this.getAttribute('data-chat-id');
        switchToChat(chatId);
    });
    
    chatItem.addEventListener('click', function(e) {
        if (!e.target.closest('.chat-link') && !e.target.closest('.chat-actions')) {
            const chatId = chatItem.querySelector('.chat-link').getAttribute('data-chat-id');
            switchToChat(chatId);
        }
    });
    
    chatItem.querySelector('.chat-action-btn.delete').addEventListener('click', async function(e) {
        e.stopPropagation();
        const chatId = this.getAttribute('data-chat-id');
        
        const { isConfirmed } = await SwalConfig.fire({
            title: 'Deletar chat?',
            text: "Esta ação não pode ser desfeita!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sim, deletar!',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#ff3b30',
            focusCancel: true
        });
        
        if (isConfirmed) {
            deleteChat(chatId);
        }
    });
}

// Muda para um chat específico
function switchToChat(chatId) {
    const chats = JSON.parse(localStorage.getItem('chatHistory')) || {};
    if (chats[chatId]) {
        localStorage.setItem('currentChatId', chatId);
        
        // Limpa as mensagens atuais
        chatMessages.innerHTML = '';
        
        // Carrega as mensagens do chat selecionado
        chats[chatId].messages.forEach(msg => {
            addMessage(msg.content, msg.isUser);
        });
        
        // Atualiza a UI
        chatMain.classList.add('has-messages');
        document.getElementById('perguntaInputBottom').focus();
        
        // Atualiza a barra lateral
        document.querySelectorAll('#chatHistory li').forEach(li => {
            li.classList.remove('active');
        });
        document.querySelector(`.chat-link[data-chat-id="${chatId}"]`).closest('li').classList.add('active');
        
        // Garante que a tabela periódica está escondida
        periodicTableContainer.style.display = 'none';
        document.querySelector('.chat-messages-container').style.display = 'flex';
        document.querySelector('.normal-position').style.display = 'block';
    }
}

// Deleta um chat
function deleteChat(chatId) {
    let chats = JSON.parse(localStorage.getItem('chatHistory')) || {};
    delete chats[chatId];
    localStorage.setItem('chatHistory', JSON.stringify(chats));
    
    if (localStorage.getItem('currentChatId') === chatId) {
        localStorage.removeItem('currentChatId');
        newChat();
    }
    
    const chatItem = document.querySelector(`.chat-link[data-chat-id="${chatId}"]`)?.closest('li');
    if (chatItem) {
        chatItem.remove();
    }
    
    if (Object.keys(chats).length === 0) {
        const emptyItem = document.createElement('li');
        emptyItem.className = 'empty-history';
        emptyItem.innerHTML = `
            <i class="fas fa-inbox"></i>
            <span>Nenhum histórico disponível</span>
        `;
        chatHistory.appendChild(emptyItem);
    }
}

// Cria um novo chat
function newChat() {
    localStorage.removeItem('currentChatId');
    chatMessages.innerHTML = '';
    chatMain.classList.remove('has-messages');
    document.getElementById('perguntaInput').focus();
    
    document.querySelectorAll('#chatHistory li').forEach(li => {
        li.classList.remove('active');
    });
    
    // Garante que a tabela periódica está escondida
    periodicTableContainer.style.display = 'none';
    document.querySelector('.chat-messages-container').style.display = 'flex';
    document.querySelector('.normal-position').style.display = 'none';
}

// Limpa todo o histórico
async function clearHistory() {
    const { isConfirmed } = await SwalConfig.fire({
        title: 'Limpar todo o histórico?',
        text: "Esta ação removerá todos os seus chats!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Limpar tudo',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#ff3b30',
        focusCancel: true
    });
    
    if (isConfirmed) {
        localStorage.removeItem('chatHistory');
        localStorage.removeItem('currentChatId');
        
        SwalConfig.fire({
            title: 'Histórico limpo!',
            text: 'Todos os chats foram removidos.',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
        }).then(() => {
            chatHistory.innerHTML = `
                <li class="empty-history">
                    <i class="fas fa-inbox"></i>
                    <span>Nenhum histórico disponível</span>
                </li>
            `;
            newChat();
        });
    }
}

// Configura o envio do formulário
function setupFormSubmit(form, input, btn) {
    const suggestedQuestions = document.getElementById('suggestedQuestions');
    const initialDisclaimer = document.getElementById('initialDisclaimer');
    
    function adjustTextareaHeight() {
        input.style.height = 'auto';
        const newHeight = Math.min(input.scrollHeight, 150);
        input.style.height = newHeight + 'px';
        input.style.overflowY = newHeight >= 150 ? 'auto' : 'hidden';
        
        if (input.value.trim().length > 0) {
            suggestedQuestions.querySelector('.suggested-questions').style.display = 'none';
            initialDisclaimer.style.display = 'block';
        } else {
            suggestedQuestions.querySelector('.suggested-questions').style.display = 'grid';
            initialDisclaimer.style.display = 'none';
        }
        
        updateSendButtonState();
    }
    
    input.addEventListener('input', adjustTextareaHeight);
    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey && input.value.trim().length > 0) {
            e.preventDefault();
            form.dispatchEvent(new Event('submit'));
        }
        adjustTextareaHeight();
    });
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const message = input.value.trim();
        if (!message) return;
        
        chatMain.classList.add('has-messages');
        addMessage(message, true);
        input.value = '';
        adjustTextareaHeight();
        
        // Ativa estado de carregamento em todos os botões de envio
        chatForms.forEach(({ btn }) => {
            btn.disabled = true;
            btn.classList.add('loading');
            btn.querySelector('.send-icon').style.display = 'none';
            btn.querySelector('.loading-square').style.display = 'block';
        });
        
        const loadingElement = showLoadingIndicator();
        
        try {
            const contexto = await buscarContexto(message);
            
            const prompt = {
                "model": MODEL_NAME,
                "messages": [
                    {
                        "role": "system",
                        "content": (
                            "Aja como um professor de química experiente que ensina alunos do ensino médio. " +
                            "Sua linguagem deve ser didática, clara e com um tom descontraído de sala de aula, mas sem " +
                            "infantilizar o conteúdo. Você DEVE seguir esta estrutura ao responder: Explique o conceito " +
                            "químico de forma objetiva, acessível e bem fundamentada. Use um exemplo do cotidiano ou uma " +
                            "analogia compatível com o nível do ensino médio para tornar o conteúdo mais fácil de visualizar. " +
                            "Inclua uma pergunta simples no final da explicação para checar se o aluno compreendeu. Sua missão " +
                            "é responder qualquer pergunta que eu fizer sobre a Tabela Periódica ou temas relacionados de " +
                            "química (como propriedades dos elementos, ligações químicas, estrutura atômica etc.). Adote um tom " +
                            "acolhedor, incentive o raciocínio do aluno, e estimule a curiosidade científica."
                        )
                    },
                    {
                        "role": "user",
                        "content": `Pergunta: ${message}\nContexto: ${contexto}`
                    }
                ],
                "temperature": 0.7,
                "max_tokens": 500
            };
            
            const headers = {
                "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
                "HTTP-Referer": window.location.href,
                "X-Title": "BotJunior"
            };
            
            const response = await fetch(OPENROUTER_API_URL, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(prompt)
            });
            
            if (!response.ok) {
                throw new Error(`Erro na API: ${response.status}`);
            }
            
            const data = await response.json();
            const resposta = limparTextoDefinitivo(data.choices[0].message.content);
            
            hideLoadingIndicator(loadingElement);
            addMessage(resposta, false);
            
            // Cria ou atualiza o chat no histórico
            const chatId = localStorage.getItem('currentChatId') || `chat_${Date.now()}`;
            if (!localStorage.getItem('currentChatId')) {
                localStorage.setItem('currentChatId', chatId);
                updateSidebar(chatId, message);
            } else {
                saveChatToLocalStorage(chatId, 
                    document.querySelector('.chat-link[data-chat-id="' + chatId + '"]').textContent, 
                    message);
            }
        } catch (error) {
            hideLoadingIndicator(loadingElement);
            addMessage("Desculpe, ocorreu um erro ao processar sua mensagem: " + error.message, false);
            console.error("Erro:", error);
        } finally {
            // Desativa estado de carregamento em todos os botões de envio
            chatForms.forEach(({ btn }) => {
                btn.disabled = false;
                btn.classList.remove('loading');
                btn.querySelector('.send-icon').style.display = 'block';
                btn.querySelector('.loading-square').style.display = 'none';
            });
            
            updateSendButtonState();
        }
    });
}

// Alterna entre temas claro/escuro
function toggleTheme() {
    const body = document.body;
    body.classList.toggle('light-theme');
    localStorage.setItem('themePreference', body.classList.contains('light-theme') ? 'light' : 'dark');
    
    const lightIcon = document.querySelector('.light-icon');
    const darkIcon = document.querySelector('.dark-icon');
    
    if (body.classList.contains('light-theme')) {
        lightIcon.style.display = 'none';
        darkIcon.style.display = 'block';
    } else {
        lightIcon.style.display = 'block';
        darkIcon.style.display = 'none';
    }
}

// Inicializa a aplicação
async function init() {
    // Carrega os dados da tabela periódica primeiro
    await loadPeriodicTableData();
    
    // Configura o tema
    const themePreference = localStorage.getItem('themePreference');
    const body = document.body;
    const lightIcon = document.querySelector('.light-icon');
    const darkIcon = document.querySelector('.dark-icon');
    
    if (themePreference === 'light') {
        body.classList.add('light-theme');
        lightIcon.style.display = 'none';
        darkIcon.style.display = 'block';
    } else {
        body.classList.remove('light-theme');
        lightIcon.style.display = 'block';
        darkIcon.style.display = 'none';
    }
    
    // Carrega chats do localStorage
    loadChatsFromLocalStorage();
    
    // Carrega chat atual se existir
    const currentChatId = localStorage.getItem('currentChatId');
    if (currentChatId) {
        const chats = JSON.parse(localStorage.getItem('chatHistory')) || {};
        if (chats[currentChatId]) {
            chatMain.classList.add('has-messages');
            chats[currentChatId].messages.forEach(msg => {
                addMessage(msg.content, msg.isUser);
            });
            document.getElementById('perguntaInputBottom').focus();
        }
    }
    
    // Configura eventos
    themeToggle.addEventListener('click', toggleTheme);
    newChatBtn.addEventListener('click', newChat);
    periodicTableBtn.addEventListener('click', togglePeriodicTable);
    clearHistoryBtn?.addEventListener('click', clearHistory);
    
    // Configura formulários
    chatForms.forEach(({ form, input, btn }) => {
        setupFormSubmit(form, input, btn);
    });
    
    // Configura eventos de teclado
    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            const activeForm = chatMain.classList.contains('has-messages') 
                ? chatForms[1].form 
                : chatForms[0].form;
            if (activeForm) {
                const input = activeForm.querySelector('textarea');
                if (input.value.trim().length > 0) {
                    activeForm.dispatchEvent(new Event('submit'));
                }
            }
        }
        
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            newChat();
        }
    });
    
    // Ajusta altura inicial dos textareas
    chatForms.forEach(({ input }) => {
        input.style.height = 'auto';
        input.style.height = input.scrollHeight + 'px';
    });
    
    // Mostra animação de carregamento
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
}

// Inicia a aplicação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', init);