# 07 — Datamodel (databaseskema)

PostgreSQL. Relationelt for identitet/roller/roster/afleveringer; **JSONB** for indhold og forsøgs-payloads. Skemaet er skitseagtigt men implementerbart. Alle elev-relaterede tabeller er underlagt data­minimering, adgangslogning og sletteregler (§02.9).

## 7.1 Entitets-overblik

```
schools ─< classes ─< class_memberships >─ users ─< user_roles >─ roles
                          │                   │
subjects ─< courses ─< modules ─< lessons ─< lesson_blocks
   │                                  │
   │                          knowledge_components ─< lesson_kc, exercise_kc
   │                                  │
   └< curriculum_goals (Fælles Mål) ─< content_curriculum_links

exercise_templates ─< exercise_instances ─< attempts ─< attempt_events
        │                                      │
        ├< hints ─< hint_views                 └< feedback_given
        └< misconceptions ─< distractors

assignments ─< assignment_targets
     └< assignment_items                submissions (elev × assignment)

progress · mastery_estimates · review_schedule · analytics_rollups · audit_log · consents
```

## 7.2 Identitet, roller, roster

```sql
CREATE TABLE schools (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stil_inst_id text UNIQUE,                 -- institutionsnr fra STIL
  name         text NOT NULL,
  municipality text,
  type         text,                        -- folkeskole | gymnasium | privat
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE users (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  unilogin_id   text UNIQUE,                -- elever
  mitid_sub     text UNIQUE,                -- lærere/forældre
  external_idp  text,                       -- lokal IdP-ref
  email         text UNIQUE,                -- egne konti (B2C/gym)
  display_name  text NOT NULL,
  birth_year    int,                        -- dataminimering: kun år hvis nødvendigt
  locale        text NOT NULL DEFAULT 'da',
  a11y_prefs    jsonb NOT NULL DEFAULT '{}',-- TTS, kontrast, enkelt sprog
  status        text NOT NULL DEFAULT 'active',
  created_at    timestamptz NOT NULL DEFAULT now(),
  last_seen_at  timestamptz
);

CREATE TABLE roles (                        -- student, teacher, school_admin, author, super_admin
  id   text PRIMARY KEY,
  name text NOT NULL
);

CREATE TABLE user_roles (                   -- en bruger kan have flere roller i flere kontekster
  user_id   uuid REFERENCES users(id) ON DELETE CASCADE,
  role_id   text REFERENCES roles(id),
  school_id uuid REFERENCES schools(id),    -- kontekst (kan være NULL for globale roller)
  PRIMARY KEY (user_id, role_id, school_id)
);

CREATE TABLE classes (                       -- "hold": et fag-hold i en klasse
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id   uuid NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  stil_group_id text UNIQUE,                -- gruppe fra STIL roster
  name        text NOT NULL,                -- fx "8.B Matematik"
  grade_level int,                          -- 5..10, gym: 10..12 (1.g..3.g)
  subject_id  text REFERENCES subjects(id),
  school_year text,                         -- fx "2026/2027"
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE class_memberships (
  class_id  uuid REFERENCES classes(id) ON DELETE CASCADE,
  user_id   uuid REFERENCES users(id) ON DELETE CASCADE,
  role_in_class text NOT NULL,              -- student | teacher | co_teacher
  level_offset  int NOT NULL DEFAULT 0,     -- differentiering pr. elev (+/- niveau)
  joined_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (class_id, user_id)
);
```

## 7.3 Fag, kurser, indholdshierarki

```sql
CREATE TABLE subjects (                      -- de fem fag
  id    text PRIMARY KEY,                    -- 'math','physics','chemistry','biology','geography'
  name  text NOT NULL,
  color text NOT NULL,
  icon  text
);

CREATE TABLE courses (                        -- fag × trin/niveau, fx "Matematik 8. kl."
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id  text NOT NULL REFERENCES subjects(id),
  title       text NOT NULL,
  stage       text NOT NULL,                 -- 'grundskole' | 'gymnasium'
  grade_level int,
  gym_level   text,                          -- 'C'|'B'|'A' (matematik) etc.
  description text,
  published   boolean NOT NULL DEFAULT false,
  position    int
);

CREATE TABLE modules (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id  uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title      text NOT NULL,
  position   int NOT NULL,
  prereq_module_ids uuid[] DEFAULT '{}'      -- bløde forudsætninger (fagkortets låse)
);

CREATE TABLE lessons (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id  uuid NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  slug       text NOT NULL,
  title      text NOT NULL,
  learning_goals jsonb NOT NULL DEFAULT '[]',-- korte mål-tekster
  position   int NOT NULL,
  est_minutes int,
  version    int NOT NULL DEFAULT 1,
  status     text NOT NULL DEFAULT 'draft',  -- draft | review | published
  UNIQUE (module_id, slug)
);

CREATE TABLE lesson_blocks (                  -- ordnede blokke: forklar/udforsk/prøv/træn/tjek
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id  uuid NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  position   int NOT NULL,
  block_type text NOT NULL,                  -- text|figure|widget|simulation|worked_example|checkpoint|exercise_ref
  payload    jsonb NOT NULL                  -- indholdsspecifik (§08)
);
```

## 7.4 Fælles Mål & knowledge components

```sql
CREATE TABLE curriculum_goals (               -- Fælles Mål / gymnasielæreplan
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  framework     text NOT NULL,                -- 'faelles_maal' | 'gym_laereplan'
  subject_id    text REFERENCES subjects(id),
  competence_area text,                       -- fx 'undersøgelse','modellering' | 'tal_og_algebra'
  goal_type     text,                         -- 'kompetencemaal'(bindende) | 'faerdigheds_videns'(vejledende)
  code          text,
  text          text NOT NULL,
  grade_span    text,                         -- fx 'efter_9'
  binding       boolean NOT NULL DEFAULT false
);

CREATE TABLE knowledge_components (           -- KC = mindste 'færdighed' vi estimerer mestring på
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id  text NOT NULL REFERENCES subjects(id),
  code        text UNIQUE NOT NULL,           -- fx 'MATH.BRØK.ADD.ULIGE_NÆVNER'
  name        text NOT NULL,
  parent_id   uuid REFERENCES knowledge_components(id)
);

CREATE TABLE lesson_kc (
  lesson_id uuid REFERENCES lessons(id) ON DELETE CASCADE,
  kc_id     uuid REFERENCES knowledge_components(id),
  PRIMARY KEY (lesson_id, kc_id)
);

CREATE TABLE content_curriculum_links (        -- kobl lektion/skabelon til mål
  content_type text NOT NULL,                  -- 'lesson' | 'exercise_template' | 'module'
  content_id   uuid NOT NULL,
  goal_id      uuid REFERENCES curriculum_goals(id),
  PRIMARY KEY (content_type, content_id, goal_id)
);
```

## 7.5 Opgaver, forsøg, hints, feedback

```sql
CREATE TABLE exercise_templates (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id   text NOT NULL REFERENCES subjects(id),
  title        text,
  difficulty   int NOT NULL DEFAULT 1,        -- 1..5
  variables    jsonb NOT NULL,                -- variabeldefinition + constraints (§08)
  prompt_tmpl  jsonb NOT NULL,                -- opgavetekst m. pladsholdere
  answer_spec  jsonb NOT NULL,                -- validator-type + parametre
  solution_tmpl jsonb,                        -- worked-example-skabelon
  version      int NOT NULL DEFAULT 1,
  status       text NOT NULL DEFAULT 'draft'
);

CREATE TABLE exercise_kc (
  template_id uuid REFERENCES exercise_templates(id) ON DELETE CASCADE,
  kc_id       uuid REFERENCES knowledge_components(id),
  weight      real NOT NULL DEFAULT 1,
  PRIMARY KEY (template_id, kc_id)
);

CREATE TABLE misconceptions (
  id       uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code     text UNIQUE NOT NULL,              -- fx 'M-BRØK-ADDERER-NÆVNERE'
  subject_id text REFERENCES subjects(id),
  name     text NOT NULL,
  explanation text                            -- målrettet forklaring vist til eleven
);

CREATE TABLE distractors (                     -- forudberegnede/mønstrede forkerte svar
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id uuid REFERENCES exercise_templates(id) ON DELETE CASCADE,
  rule        jsonb NOT NULL,                 -- hvordan distraktoren dannes af variable
  misconception_id uuid REFERENCES misconceptions(id)
);

CREATE TABLE hints (                            -- hint-stige pr. skabelon
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id uuid REFERENCES exercise_templates(id) ON DELETE CASCADE,
  level       int NOT NULL,                    -- 1..n (retningsgivende → worked step)
  body_tmpl   jsonb NOT NULL
);

CREATE TABLE feedback_rules (                   -- betinget feedback
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id uuid REFERENCES exercise_templates(id) ON DELETE CASCADE,
  condition   jsonb NOT NULL,                  -- fx {matches_misconception:'M-...'} / {closeness:'<0.1'}
  message     jsonb NOT NULL
);

CREATE TABLE exercise_instances (               -- konkret generet instans (seed)
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id uuid NOT NULL REFERENCES exercise_templates(id),
  seed        bigint NOT NULL,
  rendered    jsonb NOT NULL,                  -- konkrete tal/figur + facit + accepterede svar
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE attempts (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  instance_id   uuid NOT NULL REFERENCES exercise_instances(id),
  assignment_id uuid REFERENCES assignments(id),
  submitted_answer jsonb,
  is_correct    boolean,
  closeness     real,                          -- 0..1 hvor tæt på
  misconception_id uuid REFERENCES misconceptions(id),
  hints_used    int NOT NULL DEFAULT 0,
  duration_ms   int,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE attempt_events (                   -- fingranulær interaktionslog (widget-hændelser)
  id         bigserial PRIMARY KEY,
  attempt_id uuid NOT NULL REFERENCES attempts(id) ON DELETE CASCADE,
  ts         timestamptz NOT NULL DEFAULT now(),
  event_type text NOT NULL,                    -- input | drag | slider | submit | hint | ...
  payload    jsonb
);

CREATE TABLE hint_views (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id uuid NOT NULL REFERENCES attempts(id) ON DELETE CASCADE,
  hint_id    uuid REFERENCES hints(id),
  level      int,
  viewed_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE feedback_given (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id uuid NOT NULL REFERENCES attempts(id) ON DELETE CASCADE,
  rule_id    uuid REFERENCES feedback_rules(id),
  message    jsonb
);
```

## 7.6 Afleveringer

```sql
CREATE TABLE assignments (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id    uuid NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  created_by  uuid NOT NULL REFERENCES users(id),
  title       text NOT NULL,
  mode        text NOT NULL DEFAULT 'homework',-- homework | in_class | practice | review
  due_at      timestamptz,
  mastery_goal int,                            -- ønsket mestringsniveau (0..3)
  settings    jsonb NOT NULL DEFAULT '{}',     -- hints tilladt, tidsgrænse, antal opgaver ...
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE assignment_items (                 -- hvad afleveringen indeholder (ordnet)
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id uuid NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  item_type     text NOT NULL,                 -- lesson | template | module | review_set
  ref_id        uuid NOT NULL,
  position      int NOT NULL,
  target_count  int                            -- fx antal træningsopgaver
);

CREATE TABLE assignment_targets (               -- hvem + differentiering
  assignment_id uuid REFERENCES assignments(id) ON DELETE CASCADE,
  user_id       uuid REFERENCES users(id),      -- NULL => hele holdet
  group_tag     text,                           -- valgfri gruppe
  level_offset  int NOT NULL DEFAULT 0,
  PRIMARY KEY (assignment_id, user_id)
);

CREATE TABLE submissions (                       -- elevens status pr. aflevering
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id uuid NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  user_id       uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status        text NOT NULL DEFAULT 'not_started', -- not_started|in_progress|submitted|graded
  score         real,
  mastery_reached int,
  completed_items int NOT NULL DEFAULT 0,
  submitted_at  timestamptz,
  teacher_note  text,
  UNIQUE (assignment_id, user_id)
);
```

## 7.7 Fremskridt, mestring, repetition

```sql
CREATE TABLE mastery_estimates (                -- pr. elev × KC
  user_id     uuid REFERENCES users(id) ON DELETE CASCADE,
  kc_id       uuid REFERENCES knowledge_components(id),
  level       int NOT NULL DEFAULT 0,          -- 0 Ny · 1 Øvet · 2 Sikker · 3 Mester
  p_known     real NOT NULL DEFAULT 0.0,       -- BKT-sandsynlighed / Elo-normaliseret
  elo         real,
  attempts    int NOT NULL DEFAULT 0,
  last_correct_at timestamptz,
  updated_at  timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, kc_id)
);

CREATE TABLE progress (                          -- grovkornet fremdrift pr. elev × lektion/modul
  user_id    uuid REFERENCES users(id) ON DELETE CASCADE,
  scope_type text NOT NULL,                     -- lesson | module | course
  scope_id   uuid NOT NULL,
  percent    real NOT NULL DEFAULT 0,
  state      text NOT NULL DEFAULT 'not_started',
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, scope_type, scope_id)
);

CREATE TABLE review_schedule (                   -- spaced repetition pr. elev × KC
  user_id     uuid REFERENCES users(id) ON DELETE CASCADE,
  kc_id       uuid REFERENCES knowledge_components(id),
  due_at      timestamptz NOT NULL,
  interval_days real NOT NULL DEFAULT 1,
  ease        real NOT NULL DEFAULT 2.5,
  reps        int NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, kc_id)
);
```

## 7.8 Lærer-/skoleanalyse, revision, samtykke

```sql
CREATE TABLE analytics_rollups (                 -- forberegnet hold/skole-statistik
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scope_type  text NOT NULL,                    -- class | school | goal
  scope_id    uuid NOT NULL,
  metric      text NOT NULL,                    -- mastery_dist | misconception_freq | activity | goal_coverage
  window      text NOT NULL,                    -- day | week | term
  data        jsonb NOT NULL,
  computed_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE audit_log (                          -- GDPR: hvem så/ændrede hvilke elevdata
  id         bigserial PRIMARY KEY,
  actor_id   uuid REFERENCES users(id),
  action     text NOT NULL,                      -- view_student_data | export | change_role | ...
  subject_user_id uuid,
  context    jsonb,
  ts         timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE consents (                           -- samtykke/retsgrundlag pr. skole (databehandling)
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id  uuid REFERENCES schools(id),
  dpa_version text,                              -- databehandleraftale-version
  signed_by  text,
  signed_at  timestamptz,
  retention_policy jsonb                          -- sletteregler
);

CREATE TABLE licenses (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id   uuid REFERENCES schools(id),
  plan        text NOT NULL,                     -- trial | class | school | municipality
  subjects    text[] NOT NULL,
  seats       int,
  valid_from  date,
  valid_to    date
);
```

## 7.9 Designnoter

- **Skabelon vs. instans:** opgaver lagres som *skabeloner*; hver elev får en seedet *instans* → reproducérbar retning + snyd-resistens + uendelig variation.
- **KC som omdrejningspunkt:** mestring, repetition, anbefalinger og Fælles Mål-dækning hænger alle på `knowledge_components`.
- **Content som JSONB + versionering:** indhold kan udvikles/versioneres uden skemaændringer; `status`/`version` styrer udgivelse.
- **GDPR indbygget:** `audit_log`, `consents`, dataminimering (kun `birth_year`), sletteregler, adgang altid via (rolle × kontekst) og logget.
- **Indeksering (udeladt for kortheds skyld):** tunge indeks på `attempts(user_id, created_at)`, `mastery_estimates(user_id)`, `review_schedule(user_id, due_at)`, `submissions(assignment_id)`.
