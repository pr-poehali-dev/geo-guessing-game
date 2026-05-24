import Icon from '@/components/ui/icon';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

const HERO_BG = 'https://cdn.poehali.dev/projects/4959674e-1412-45a6-97b6-9d7270862d54/files/b9fbcbc5-715a-423d-bc8c-72661e64aa19.jpg';

const FEATURES = [
  { icon: 'Globe', title: 'Весь мир', desc: '20+ уникальных локаций на всех континентах — от Парижа до Антарктиды' },
  { icon: 'Clock', title: 'Таймер', desc: 'Настрой время от 15 до 120 секунд. Чем быстрее угадаешь — тем больше очков' },
  { icon: 'Lightbulb', title: 'Подсказки', desc: 'До 2 подсказок за раунд, если совсем застрял. Используй мудро!' },
  { icon: 'Users', title: 'Мультиплеер', desc: 'Соревнуйся с друзьями в реальном времени. Создавай комнаты до 8 игроков' },
  { icon: 'Star', title: 'Достижения', desc: '12 уникальных достижений от «Первый шаг» до «Легенда»' },
  { icon: 'BarChart2', title: 'Рейтинг', desc: 'Глобальная таблица лидеров. Докажи, что ты лучший географ' },
];

const DIFFICULTIES = [
  { id: 'easy', label: 'Лёгкий', desc: 'Известные мировые столицы', color: 'text-teal', bg: 'bg-teal/10 border-teal/30', icon: '🌱' },
  { id: 'medium', label: 'Средний', desc: 'Крупные города мира', color: 'text-gold', bg: 'bg-gold/10 border-gold/30', icon: '🔥' },
  { id: 'hard', label: 'Сложный', desc: 'Неочевидные локации', color: 'text-destructive', bg: 'bg-destructive/10 border-destructive/30', icon: '💀' },
];

export default function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${HERO_BG})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background" />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-gold/20 text-gold text-sm font-medium mb-8 animate-pulse-glow">
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
            Неограниченные попытки — играй сколько хочешь
          </div>

          <h1 className="font-display font-black text-5xl md:text-7xl lg:text-8xl mb-6 leading-none">
            <span className="text-gold-gradient">Geo</span>
            <span className="text-foreground">Star</span>
          </h1>

          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-10 font-body leading-relaxed">
            Угадывай города и страны по фотографиям. Соревнуйся с друзьями. Открывай новые уголки планеты.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => onNavigate('game')}
              className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-gold text-background font-display font-bold text-lg hover:bg-gold-light transition-all duration-300 hover:scale-105 shadow-xl shadow-gold/20 animate-pulse-glow"
            >
              <Icon name="Play" size={22} />
              Играть сейчас
            </button>
            <button
              onClick={() => onNavigate('multiplayer')}
              className="flex items-center gap-3 px-8 py-4 rounded-2xl glass border border-border hover:border-gold/30 text-foreground font-medium text-lg transition-all duration-300 hover:scale-105"
            >
              <Icon name="Users" size={20} />
              Мультиплеер
            </button>
          </div>

          {/* Difficulty badges */}
          <div className="flex gap-3 justify-center mt-10 flex-wrap">
            {DIFFICULTIES.map(d => (
              <div key={d.id} className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${d.bg} text-sm font-medium ${d.color}`}>
                <span>{d.icon}</span>
                <span>{d.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
          <Icon name="ChevronDown" size={24} className="text-muted-foreground" />
        </div>
      </section>

      {/* Stats row */}
      <section className="px-4 md:px-8 py-12 max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Локаций', value: '20+', icon: '📍' },
            { label: 'Стран', value: '15+', icon: '🌍' },
            { label: 'Достижений', value: '12', icon: '🏆' },
            { label: 'Игроков онлайн', value: '∞', icon: '👥' },
          ].map((stat, i) => (
            <div
              key={i}
              className="glass rounded-2xl p-5 text-center hover-lift"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="font-display font-bold text-2xl text-gold">{stat.value}</div>
              <div className="text-muted-foreground text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="px-4 md:px-8 py-12 max-w-5xl mx-auto">
        <h2 className="font-display font-bold text-2xl md:text-3xl text-center mb-10">
          Всё для идеальной игры
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <div
              key={i}
              className="glass rounded-2xl p-6 hover-lift group"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="w-11 h-11 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors">
                <Icon name={f.icon} size={20} className="text-gold" />
              </div>
              <h3 className="font-display font-semibold text-base mb-2">{f.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 md:px-8 py-16 max-w-3xl mx-auto text-center">
        <div className="glass rounded-3xl p-10 border border-gold/15 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-teal/5 pointer-events-none" />
          <h2 className="font-display font-bold text-2xl md:text-3xl mb-4 relative">
            Готов исследовать планету? 🌏
          </h2>
          <p className="text-muted-foreground mb-8 relative">
            Выбери сложность, настрой таймер и отправляйся в путешествие. Без ограничений по количеству игр!
          </p>
          <button
            onClick={() => onNavigate('game')}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gold text-background font-display font-bold text-lg hover:bg-gold-light transition-all duration-300 hover:scale-105 shadow-xl shadow-gold/20"
          >
            <Icon name="Rocket" size={20} />
            Начать игру
          </button>
        </div>
      </section>
    </div>
  );
}
