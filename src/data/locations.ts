export interface Location {
  id: number;
  lat: number;
  lng: number;
  country: string;
  city: string;
  continent: string;
  difficulty: 'easy' | 'medium' | 'hard';
  imageUrl: string;
  hints: string[];
  funFact: string;
}

export const LOCATIONS: Location[] = [
  {
    id: 1, lat: 48.8566, lng: 2.3522, country: 'Франция', city: 'Париж', continent: 'Европа',
    difficulty: 'easy',
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&q=80',
    hints: ['Столица европейской страны с романтической репутацией', 'Здесь находится знаменитая железная башня'],
    funFact: 'Эйфелева башня каждое лето вырастает на 15 см из-за расширения металла!'
  },
  {
    id: 2, lat: 35.6762, lng: 139.6503, country: 'Япония', city: 'Токио', continent: 'Азия',
    difficulty: 'easy',
    imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200&q=80',
    hints: ['Самый населённый мегаполис в мире', 'Страна восходящего солнца'],
    funFact: 'В Токио более 200 км метро и 13 линий — одна из крупнейших подземок мира!'
  },
  {
    id: 3, lat: -22.9068, lng: -43.1729, country: 'Бразилия', city: 'Рио-де-Жанейро', continent: 'Южная Америка',
    difficulty: 'easy',
    imageUrl: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=1200&q=80',
    hints: ['Карнавал длится целую неделю', 'Статуя с раскрытыми объятиями'],
    funFact: 'Статуя Христа-Искупителя получает удар молнии в среднем 3-5 раз в год!'
  },
  {
    id: 4, lat: 41.9028, lng: 12.4964, country: 'Италия', city: 'Рим', continent: 'Европа',
    difficulty: 'easy',
    imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1200&q=80',
    hints: ['Вечный город с тысячелетней историей', 'Маленькое государство внутри города'],
    funFact: 'В фонтан Треви ежегодно бросают монеты на сумму более 1 миллиона евро!'
  },
  {
    id: 5, lat: 51.5074, lng: -0.1278, country: 'Великобритания', city: 'Лондон', continent: 'Европа',
    difficulty: 'easy',
    imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200&q=80',
    hints: ['Большие красные автобусы и телефонные будки', 'Часы на башне — символ города'],
    funFact: 'Лондонский Тауэр никогда не пустует — там живут воронята по королевскому указу!'
  },
  {
    id: 6, lat: 40.7128, lng: -74.0060, country: 'США', city: 'Нью-Йорк', continent: 'Северная Америка',
    difficulty: 'easy',
    imageUrl: 'https://images.unsplash.com/photo-1546436836-07a91091f160?w=1200&q=80',
    hints: ['Никогда не спящий город', 'Статуя с факелом в руке'],
    funFact: 'В Нью-Йорке есть улицы, которые идут под землёй целые кварталы!'
  },
  {
    id: 7, lat: 55.7558, lng: 37.6173, country: 'Россия', city: 'Москва', continent: 'Европа',
    difficulty: 'easy',
    imageUrl: 'https://images.unsplash.com/photo-1513326738677-b964603b136d?w=1200&q=80',
    hints: ['Разноцветные луковичные купола на главной площади', 'Самое большое метро с богатыми станциями'],
    funFact: 'Московское метро строилось как бомбоубежище, некоторые станции уходят на 100 м вглубь!'
  },
  {
    id: 8, lat: -33.8688, lng: 151.2093, country: 'Австралия', city: 'Сидней', continent: 'Австралия',
    difficulty: 'medium',
    imageUrl: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=1200&q=80',
    hints: ['Знаменитый оперный театр напоминает паруса', 'На самом деле это не столица страны'],
    funFact: 'Сиднейский оперный театр стал объектом ЮНЕСКО при живом архитекторе!'
  },
  {
    id: 9, lat: 25.2048, lng: 55.2708, country: 'ОАЭ', city: 'Дубай', continent: 'Азия',
    difficulty: 'medium',
    imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=80',
    hints: ['Самое высокое здание в мире здесь', 'Торговые центры с лыжными трассами'],
    funFact: 'Бурдж-Халифа настолько высок, что жители верхних этажей могут смотреть закат дважды!'
  },
  {
    id: 10, lat: 1.3521, lng: 103.8198, country: 'Сингапур', city: 'Сингапур', continent: 'Азия',
    difficulty: 'medium',
    imageUrl: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1200&q=80',
    hints: ['Город-государство, один из самых чистых в мире', 'Отель с бассейном на крыше в форме лодки'],
    funFact: 'В Сингапуре жевательная резинка запрещена с 1992 года!'
  },
  {
    id: 11, lat: 27.1751, lng: 78.0421, country: 'Индия', city: 'Агра', continent: 'Азия',
    difficulty: 'medium',
    imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1200&q=80',
    hints: ['Мраморный мавзолей — символ вечной любви', 'Построен за 22 года'],
    funFact: 'Тадж-Махал меняет цвет в зависимости от времени суток — розовый на рассвете, белый днём, золотой при луне!'
  },
  {
    id: 12, lat: -13.5320, lng: -71.9675, country: 'Перу', city: 'Мачу-Пикчу', continent: 'Южная Америка',
    difficulty: 'hard',
    imageUrl: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=1200&q=80',
    hints: ['Потерянный город инков в горах', 'Высота более 2400 метров над уровнем моря'],
    funFact: 'Мачу-Пикчу был «заново открыт» в 1911 году, хотя местные жители знали о нём всегда!'
  },
  {
    id: 13, lat: 30.0444, lng: 31.2357, country: 'Египет', city: 'Каир', continent: 'Африка',
    difficulty: 'medium',
    imageUrl: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=1200&q=80',
    hints: ['Рядом с пустыней и древними пирамидами', 'Загадочный сфинкс'],
    funFact: 'Великая пирамида Гизы была самым высоким строением на Земле почти 4000 лет!'
  },
  {
    id: 14, lat: 59.9139, lng: 10.7522, country: 'Норвегия', city: 'Осло', continent: 'Европа',
    difficulty: 'hard',
    imageUrl: 'https://images.unsplash.com/photo-1539093484427-c3b5e28e87e5?w=1200&q=80',
    hints: ['Фьорды и северное сияние рядом', 'Одна из стран с самым высоким уровнем жизни'],
    funFact: 'Норвегия владеет 1,5% всех публичных компаний в мире через свой нефтяной фонд!'
  },
  {
    id: 15, lat: -4.3217, lng: 15.3222, country: 'Конго', city: 'Киншаса', continent: 'Африка',
    difficulty: 'hard',
    imageUrl: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1200&q=80',
    hints: ['Один из крупнейших городов Африки', 'Расположен на реке Конго'],
    funFact: 'Киншаса и Браззавиль — единственные две столицы мира, видимые друг из друга через реку!'
  },
  {
    id: 16, lat: 64.1265, lng: -21.8174, country: 'Исландия', city: 'Рейкьявик', continent: 'Европа',
    difficulty: 'hard',
    imageUrl: 'https://images.unsplash.com/photo-1520769945061-0a448c463865?w=1200&q=80',
    hints: ['Самая северная столица мира', 'Страна вулканов, гейзеров и полярного сияния'],
    funFact: 'В Исландии нет комаров — единственная населённая страна мира без этих насекомых!'
  },
  {
    id: 17, lat: 43.7696, lng: 11.2558, country: 'Италия', city: 'Флоренция', continent: 'Европа',
    difficulty: 'medium',
    imageUrl: 'https://images.unsplash.com/photo-1541370976299-4d24ebbc9077?w=1200&q=80',
    hints: ['Колыбель итальянского Ренессанса', 'Крупнейший купол в мире по размерам'],
    funFact: 'Галерея Уффици имеет столько шедевров, что половина из них хранится в запасниках!'
  },
  {
    id: 18, lat: 13.7563, lng: 100.5018, country: 'Таиланд', city: 'Бангкок', continent: 'Азия',
    difficulty: 'medium',
    imageUrl: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=1200&q=80',
    hints: ['Тысячи золотых храмов', 'Полное название города — одно из самых длинных в мире'],
    funFact: 'Полное название Бангкока состоит из 163 букв и занесено в Книгу рекордов Гиннесса!'
  },
  {
    id: 19, lat: 41.0082, lng: 28.9784, country: 'Турция', city: 'Стамбул', continent: 'Европа/Азия',
    difficulty: 'medium',
    imageUrl: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1200&q=80',
    hints: ['Единственный город на двух континентах', 'Знаменитые голубые мечети'],
    funFact: 'Стамбул — единственный город в мире, расположенный сразу на двух континентах!'
  },
  {
    id: 20, lat: -34.6037, lng: -58.3816, country: 'Аргентина', city: 'Буэнос-Айрес', continent: 'Южная Америка',
    difficulty: 'hard',
    imageUrl: 'https://images.unsplash.com/photo-1589909202802-8f4aadce1849?w=1200&q=80',
    hints: ['Родина танго', 'Называют "Парижем Южной Америки"'],
    funFact: 'В Буэнос-Айресе больше психоаналитиков на душу населения, чем в любом другом городе мира!'
  },
];

export function getLocationsByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): Location[] {
  return LOCATIONS.filter(l => l.difficulty === difficulty);
}

export function getRandomLocations(count: number, difficulty?: 'easy' | 'medium' | 'hard'): Location[] {
  const pool = difficulty ? getLocationsByDifficulty(difficulty) : LOCATIONS;
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function calculateScore(distanceKm: number, timeLeft: number, maxTime: number): number {
  const maxScore = 5000;
  const distanceFactor = Math.max(0, 1 - distanceKm / 20000);
  const timeFactor = maxTime > 0 ? 0.8 + 0.2 * (timeLeft / maxTime) : 1;
  return Math.round(maxScore * distanceFactor * timeFactor);
}
