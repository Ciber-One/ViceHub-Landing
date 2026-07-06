from fastapi import FastAPI, APIRouter, HTTPException, Depends, Header, UploadFile, File, Request
from fastapi.responses import StreamingResponse, Response
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import re
import html
import json
import uuid
import asyncio
import logging
from pathlib import Path
from typing import Optional, List
from pydantic import BaseModel, EmailStr
import asyncpg
import resend
from openai import OpenAI


import auth as auth_lib
import storage as storage_lib

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

DATABASE_URL = os.environ['DATABASE_URL']
EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY')
GROQ_API_KEY = os.environ.get('GROQ_API_KEY')
GROQ_MODEL = os.environ.get('GROQ_MODEL', 'llama-3.3-70b-versatile')
RESEND_API_KEY = os.environ.get('RESEND_API_KEY')
print("RESEND_API_KEY exists:", bool(RESEND_API_KEY))
print("RESEND_API_KEY length:", len(RESEND_API_KEY) if RESEND_API_KEY else 0)
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')
ADMIN_EMAIL = os.environ.get('ADMIN_EMAIL', 'admin@vicehub.gg')
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'ViceHub@2026')
resend.api_key = RESEND_API_KEY

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger("vicehub")

app = FastAPI()
api_router = APIRouter(prefix="/api")
pool: Optional[asyncpg.Pool] = None

SCHEMA_SQL = """
CREATE TABLE IF NOT EXISTS waitlist (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email text UNIQUE NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    status text NOT NULL DEFAULT 'subscribed',
    confirmation_sent boolean NOT NULL DEFAULT false,
    source text DEFAULT 'landing',
    metadata jsonb DEFAULT '{}'::jsonb
);
CREATE TABLE IF NOT EXISTS admin_users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email text UNIQUE NOT NULL,
    password_hash text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS blog_posts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    slug text UNIQUE NOT NULL,
    title text NOT NULL,
    excerpt text DEFAULT '',
    content text NOT NULL DEFAULT '',
    cover_path text,
    tags text[] DEFAULT '{}',
    meta_title text,
    meta_description text,
    author text DEFAULT 'ViceHub Team',
    category text NOT NULL DEFAULT 'News',
    published boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS category text NOT NULL DEFAULT 'News';
"""


async def seed_admin():
    h = auth_lib.hash_password(ADMIN_PASSWORD)
    async with pool.acquire() as conn:
        row = await conn.fetchrow("SELECT password_hash FROM admin_users WHERE email=$1", ADMIN_EMAIL)
        if row is None:
            await conn.execute("INSERT INTO admin_users (email, password_hash) VALUES ($1, $2)", ADMIN_EMAIL, h)
            logger.info("Admin seeded")
        elif not auth_lib.verify_password(ADMIN_PASSWORD, row["password_hash"]):
            await conn.execute("UPDATE admin_users SET password_hash=$2 WHERE email=$1", ADMIN_EMAIL, h)
            logger.info("Admin password updated")


_SK = "https://static.prod-images.emergentagent.com/jobs/c3ff5206-e1ba-4182-b507-06a131cfcfbd/images/4f770465f410a6b03417f5d8281c02a237a3aa795ea3ae404e79eeae42972bc2.png"
_MAP = "https://static.prod-images.emergentagent.com/jobs/c3ff5206-e1ba-4182-b507-06a131cfcfbd/images/0074ec6bd39cd6f0ebc002894bcbc7845f202c338062056848092ce5e4b9d0eb.png"
_BRICKELL = "https://images.pexels.com/photos/36572017/pexels-photo-36572017.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
_CAR = "https://images.pexels.com/photos/35319488/pexels-photo-35319488.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
_CITY = "https://images.pexels.com/photos/4092992/pexels-photo-4092992.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"

SEED_POSTS = [
    {
        "slug": "gta-6-release-date",
        "title": "GTA 6 Release Date: Everything We Know",
        "category": "News",
        "tags": ["GTA 6", "Release Date", "News"],
        "cover": _SK,
        "excerpt": "Grand Theft Auto VI is set to launch on November 19, 2026. Here's the timeline, platforms and what it means for players.",
        "content": "## When does GTA 6 come out?\n\nRockstar Games has confirmed that **Grand Theft Auto VI launches on November 19, 2026** for PlayStation 5 and Xbox Series X|S. After years of anticipation, we finally have a firm date to count down to.\n\n## Which platforms?\n\nGTA 6 arrives first on current-generation consoles. Following Rockstar's usual pattern, a PC release is widely expected to follow at a later date, though nothing official has been announced yet.\n\n## Why the wait was worth it\n\nRockstar pushed the date to give the game the level of polish players expect from a generational release. Set in a modern reimagining of Vice City and the wider state of Leonida, GTA 6 promises the studio's most ambitious open world yet.\n\n## Get ready with ViceHub\n\nViceHub is your companion for launch day. From an interactive map to an AI assistant, we're building everything you'll want by your side when the clock hits zero. Join the waitlist and be ready before everyone else.",
    },
    {
        "slug": "gta-6-map",
        "title": "GTA 6 Map: Exploring Vice City and Leonida",
        "category": "Guides",
        "tags": ["GTA 6", "Map", "Vice City", "Guides"],
        "cover": _MAP,
        "excerpt": "A look at the GTA 6 map — the neon-soaked streets of Vice City and the sprawling state of Leonida.",
        "content": "## A bigger, bolder world\n\nGTA 6 returns to **Vice City**, the Miami-inspired metropolis fans have wanted for over two decades, set within the larger fictional state of **Leonida**. Expect dense urban blocks, sun-drenched beaches, wetlands, and miles of highway connecting it all.\n\n## What players want from the map\n\n- Fast, readable navigation between districts\n- Easy ways to bookmark favourite spots\n- Smart route planning that fits your playstyle\n- A clear view of what's worth exploring next\n\n## How ViceHub helps you explore\n\nOur concept interactive map is designed to make a world this big feel effortless. Filter by category, search instantly, and let the AI companion suggest where to head next. *Concept previews shown — features become available after launch.*\n\nReady to explore smarter? Join the ViceHub waitlist today.",
    },
    {
        "slug": "gta-6-characters-jason-and-lucia",
        "title": "GTA 6 Characters: Meet Jason and Lucia",
        "category": "News",
        "tags": ["GTA 6", "Characters", "Story", "News"],
        "cover": _BRICKELL,
        "excerpt": "GTA 6 introduces dual protagonists Jason and Lucia in a modern Vice City crime story.",
        "content": "## A new kind of GTA story\n\nGTA 6 puts the spotlight on **Jason and Lucia**, a duo at the heart of a modern Vice City crime saga. It's a fresh direction for the series and one of the most talked-about elements heading into launch.\n\n## Why dual protagonists matter\n\nTwo leads means more perspectives, more ways to approach the world, and a richer story to follow. Keeping track of two journeys also means there's more to plan, organize and explore.\n\n## Track every thread with ViceHub\n\nViceHub is being built to help you keep your bearings across a sprawling story — your progress, your goals, and your next move, all in one elegant place. Join the waitlist to experience it at launch.",
    },
    {
        "slug": "gta-6-vehicles-what-to-expect",
        "title": "GTA 6 Vehicles: What to Expect",
        "category": "Guides",
        "tags": ["GTA 6", "Vehicles", "Cars", "Guides"],
        "cover": _CAR,
        "excerpt": "Cars, bikes, boats and more — what the GTA 6 garage might hold and how to find your perfect ride.",
        "content": "## The garage of your dreams\n\nEvery GTA is defined in part by its vehicles, and GTA 6's Vice City setting is begging for sleek supercars, classic convertibles, speedboats and more. Cruising the coast at sunset is going to look incredible.\n\n## Finding the right ride\n\nWith a huge roster expected, the hard part is choosing. The right vehicle depends on how you play — speed, style, off-road, or pure flex.\n\n## Vehicle Explorer, by ViceHub\n\nOur concept Vehicle Explorer is designed to help you compare, shortlist and discover rides that match your vibe. *Concept previews shown — features become available after launch.*\n\nWant first access? Join the ViceHub waitlist.",
    },
    {
        "slug": "vicehub-gta-6-ai-companion",
        "title": "How ViceHub Will Change the Way You Play GTA 6",
        "category": "Product",
        "tags": ["ViceHub", "AI Companion", "Product"],
        "cover": _CITY,
        "excerpt": "Meet ViceHub — one intelligent platform to explore, track, discover and plan your entire GTA 6 journey.",
        "content": "## One companion for everything\n\nGTA 6 is going to be massive. ViceHub is being built so you spend less time searching and more time playing — a single, beautiful home for your whole journey.\n\n## What's coming\n\n- **AI Companion** — ask anything, get answers in seconds\n- **Interactive Map** — explore and plan routes effortlessly\n- **Progress Dashboard** — your stats and milestones at a glance\n- **And much more** — collectibles, vehicles, businesses and beyond\n\n## Built for launch day\n\nViceHub launches alongside GTA 6 on November 19, 2026. *Concept previews shown — features become available after launch.*\n\nJoin the waitlist and be among the first players to experience it.",
    },
]


async def seed_posts():
    async with pool.acquire() as conn:
        for p in SEED_POSTS:
            await conn.execute(
                """INSERT INTO blog_posts (slug, title, excerpt, content, cover_path, tags, meta_title, meta_description, author, category, published)
                   VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,true)
                   ON CONFLICT (slug) DO NOTHING""",
                p["slug"], p["title"], p["excerpt"], p["content"], p["cover"], p["tags"],
                p["title"], p["excerpt"], "ViceHub Team", p["category"],
            )


@app.on_event("startup")
async def startup():
    global pool
    pool = await asyncpg.create_pool(dsn=DATABASE_URL, statement_cache_size=0, min_size=1, max_size=10)
    async with pool.acquire() as conn:
        await conn.execute(SCHEMA_SQL)
    await seed_admin()
    await seed_posts()
    try:
        storage_lib.init_storage()
        logger.info("Storage initialized")
    except Exception as e:
        logger.error(f"Storage init failed: {e}")
    logger.info("Startup complete")


@app.on_event("shutdown")
async def shutdown():
    if pool:
        await pool.close()


# ---------- Models ----------
class WaitlistCreate(BaseModel):
    email: EmailStr
    source: str = "landing"


class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class PostInput(BaseModel):
    title: str
    slug: Optional[str] = None
    excerpt: str = ""
    content: str = ""
    cover_path: Optional[str] = None
    tags: List[str] = []
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    author: str = "ViceHub Team"
    category: str = "News"
    published: bool = True


# ---------- Auth helpers ----------
async def get_current_admin(authorization: Optional[str] = Header(None)):
    token = None
    if authorization and authorization.startswith("Bearer "):
        token = authorization[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = auth_lib.decode_token(token)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    email = payload.get("sub")
    async with pool.acquire() as conn:
        row = await conn.fetchrow("SELECT id, email FROM admin_users WHERE email=$1", email)
    if not row:
        raise HTTPException(status_code=401, detail="Admin not found")
    return {"id": str(row["id"]), "email": row["email"]}


# ---------- Email ----------
def confirmation_html(email: str) -> str:
    return f"""
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#0b0b0d;padding:40px 0;font-family:Arial,Helvetica,sans-serif;">
      <tr>
        <td align="center">

          <table width="600" cellpadding="0" cellspacing="0"
                 style="background:#17181d;border:1px solid #2a2d35;border-radius:20px;overflow:hidden;">

            <tr>
              <td style="padding:40px;text-align:center;">

                <div style="font-size:13px;letter-spacing:5px;color:#ff6b3d;font-weight:bold;">
                  VICEHUB
                </div>

                <h1 style="margin:18px 0 12px;color:#ffffff;font-size:36px;">
                  You're Officially In.
                </h1>

                <p style="color:#c8ccd4;font-size:17px;line-height:1.8;">
                  Thanks for joining the exclusive ViceHub waitlist.
                  You're among the first players who will experience our
                  AI-powered GTA 6 companion before launch.
                </p>

              </td>
            </tr>

            <tr>
              <td style="padding:0 40px;">

                <table width="100%" cellpadding="16"
                       style="background:#20232b;border-radius:14px;">

                  <tr>
                    <td style="color:white;font-size:16px;">
                      ✓ AI Companion<br><br>
                      ✓ Interactive Map<br><br>
                      ✓ Wallpapers<br><br>
                      ✓ Community Discussions<br><br>
                      ✓ Launch Guides
                    </td>
                  </tr>

                </table>

              </td>
            </tr>

            <tr>
              <td align="center" style="padding:40px;">

                <a href="https://www.vicehub.live"
                   style="background:#ff6b3d;
                          color:white;
                          text-decoration:none;
                          padding:16px 34px;
                          border-radius:10px;
                          font-size:17px;
                          font-weight:bold;
                          display:inline-block;">
                  Visit ViceHub
                </a>

              </td>
            </tr>

            <tr>
              <td align="center"
                  style="padding:0 40px 40px;
                         color:#8b9099;
                         font-size:13px;
                         line-height:1.8;">

                Launching alongside GTA 6 on
                <strong style="color:#ffffff;">November 19, 2026</strong>.

                <br><br>

                © 2026 ViceHub • https://www.vicehub.live

              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>
    """


async def send_confirmation(email: str) -> bool:
    if not RESEND_API_KEY:
        return False
    params = {"from": f"ViceHub <{SENDER_EMAIL}>", "to": [email],
              "subject": "Welcome to the ViceHub waitlist", "html": confirmation_html(email)}
    try:
        await asyncio.to_thread(resend.Emails.send, params)
        return True
    except Exception as e:
        logger.error(f"Resend failed: {e}")
        return False


# ---------- Routes: core ----------
@api_router.get("/")
async def root():
    return {"message": "ViceHub API"}


@api_router.post("/waitlist")
async def join_waitlist(body: WaitlistCreate):
    email = body.email.lower().strip()
    async with pool.acquire() as conn:
        existing = await conn.fetchrow("SELECT id FROM waitlist WHERE email=$1", email)
        if existing:
            return {"success": True, "already_joined": True, "message": "You're already on the list."}
        await conn.execute("INSERT INTO waitlist (email, source) VALUES ($1, $2)", email, body.source)
    sent = await send_confirmation(email)
    if sent:
        async with pool.acquire() as conn:
            await conn.execute("UPDATE waitlist SET confirmation_sent=true WHERE email=$1", email)
    return {"success": True, "already_joined": False, "confirmation_sent": sent, "message": "You're on the list."}


@api_router.get("/waitlist/count")
async def waitlist_count():
    async with pool.acquire() as conn:
        count = await conn.fetchval("SELECT COUNT(*) FROM waitlist")
    return {"count": int(count or 0)}


SYSTEM_PROMPT = (
    "You are the ViceHub AI Companion, a sleek concept assistant for the upcoming game Grand Theft Auto VI "
    "(launching November 19, 2026). ViceHub is a pre-launch product whose features are not live yet. "
    "Speak in a confident, premium, friendly tone. CRITICAL RULES: GTA 6 is NOT out yet, so you must NEVER state "
    "real in-game facts, missions, prices, vehicles, or map details as if they exist. Instead, frame every answer "
    "as a stylish concept preview of what ViceHub WILL help players do once the game launches. Keep replies to "
    "2-4 short, exciting sentences. Plain text only, no markdown headings or bullet symbols."
)


@api_router.post("/companion/chat")
async def companion_chat(body: ChatRequest):
    message = body.message.strip()
    if not message:
        raise HTTPException(status_code=422, detail="Message is required")
    if not GROQ_API_KEY:
        raise HTTPException(status_code=503, detail="AI Companion is not configured")

    def stream_groq():
        try:
            client = OpenAI(
                base_url="https://api.groq.com/openai/v1",
                api_key=GROQ_API_KEY,
            )
            stream = client.chat.completions.create(
                model=GROQ_MODEL,
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": message},
                ],
                temperature=0.7,
                max_completion_tokens=220,
                top_p=0.9,
                stream=True,
            )
            for chunk in stream:
                delta = chunk.choices[0].delta.content
                if delta:
                    yield f"data: {json.dumps({'delta': delta})}\n\n"
            yield f"data: {json.dumps({'done': True})}\n\n"
        except Exception as e:
            logger.error(f"Groq companion failed: {e}")
            yield f"data: {json.dumps({'error': 'AI Companion is temporarily unavailable.'})}\n\n"

    return StreamingResponse(stream_groq(), media_type="text/event-stream")


# ---------- Routes: auth ----------
@api_router.post("/auth/login")
async def login(body: LoginRequest):
    email = body.email.lower().strip()
    async with pool.acquire() as conn:
        row = await conn.fetchrow("SELECT email, password_hash FROM admin_users WHERE email=$1", email)
    if not row or not auth_lib.verify_password(body.password, row["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return {"token": auth_lib.create_token(email), "email": email}


@api_router.get("/auth/me")
async def me(admin=Depends(get_current_admin)):
    return admin


# ---------- Blog helpers ----------
def slugify(text: str) -> str:
    text = (text or "").lower().strip()
    text = re.sub(r"[^a-z0-9\s-]", "", text)
    text = re.sub(r"[\s_-]+", "-", text)
    return text.strip("-") or "post"


async def unique_slug(conn, base: str, exclude_id: Optional[str] = None) -> str:
    slug = slugify(base)
    candidate = slug
    i = 2
    while True:
        if exclude_id:
            row = await conn.fetchrow("SELECT id FROM blog_posts WHERE slug=$1 AND id<>$2", candidate, exclude_id)
        else:
            row = await conn.fetchrow("SELECT id FROM blog_posts WHERE slug=$1", candidate)
        if not row:
            return candidate
        candidate = f"{slug}-{i}"
        i += 1


def reading_time(content: str) -> int:
    words = len((content or "").split())
    return max(1, round(words / 200))


def serialize_post(r, include_content=True) -> dict:
    d = dict(r)
    d["id"] = str(d["id"])
    d["tags"] = list(d.get("tags") or [])
    for k in ("created_at", "updated_at"):
        if d.get(k) is not None:
            d[k] = d[k].isoformat()
    d["reading_time"] = reading_time(d.get("content") or "")
    if not include_content:
        d.pop("content", None)
    return d


# ---------- Routes: blog public ----------
@api_router.get("/blog/posts")
async def list_posts():
    async with pool.acquire() as conn:
        rows = await conn.fetch("SELECT * FROM blog_posts WHERE published=true ORDER BY created_at DESC")
    return [serialize_post(r, include_content=False) for r in rows]


@api_router.get("/blog/posts/{slug}")
async def get_post(slug: str):
    async with pool.acquire() as conn:
        row = await conn.fetchrow("SELECT * FROM blog_posts WHERE slug=$1 AND published=true", slug)
    if not row:
        raise HTTPException(status_code=404, detail="Post not found")
    return serialize_post(row)


@api_router.get("/blog/image/{path:path}")
async def blog_image(path: str):
    try:
        data, content_type = await asyncio.to_thread(storage_lib.get_object, path)
    except Exception:
        raise HTTPException(status_code=404, detail="Image not found")
    return Response(content=data, media_type=content_type, headers={"Cache-Control": "public, max-age=86400"})


# ---------- Routes: blog admin ----------
@api_router.get("/blog/admin/posts")
async def admin_list_posts(admin=Depends(get_current_admin)):
    async with pool.acquire() as conn:
        rows = await conn.fetch("SELECT * FROM blog_posts ORDER BY created_at DESC")
    return [serialize_post(r, include_content=False) for r in rows]


@api_router.get("/blog/admin/posts/{post_id}")
async def admin_get_post(post_id: str, admin=Depends(get_current_admin)):
    async with pool.acquire() as conn:
        row = await conn.fetchrow("SELECT * FROM blog_posts WHERE id=$1", post_id)
    if not row:
        raise HTTPException(status_code=404, detail="Post not found")
    return serialize_post(row)


@api_router.post("/blog/posts")
async def create_post(body: PostInput, admin=Depends(get_current_admin)):
    async with pool.acquire() as conn:
        slug = await unique_slug(conn, body.slug or body.title)
        row = await conn.fetchrow(
            """INSERT INTO blog_posts (slug, title, excerpt, content, cover_path, tags, meta_title, meta_description, author, category, published)
               VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *""",
            slug, body.title, body.excerpt, body.content, body.cover_path, body.tags,
            body.meta_title, body.meta_description, body.author, body.category, body.published,
        )
    return serialize_post(row)


@api_router.put("/blog/posts/{post_id}")
async def update_post(post_id: str, body: PostInput, admin=Depends(get_current_admin)):
    async with pool.acquire() as conn:
        existing = await conn.fetchrow("SELECT id FROM blog_posts WHERE id=$1", post_id)
        if not existing:
            raise HTTPException(status_code=404, detail="Post not found")
        slug = await unique_slug(conn, body.slug or body.title, exclude_id=post_id)
        row = await conn.fetchrow(
            """UPDATE blog_posts SET slug=$2, title=$3, excerpt=$4, content=$5, cover_path=$6, tags=$7,
               meta_title=$8, meta_description=$9, author=$10, category=$11, published=$12, updated_at=now()
               WHERE id=$1 RETURNING *""",
            post_id, slug, body.title, body.excerpt, body.content, body.cover_path, body.tags,
            body.meta_title, body.meta_description, body.author, body.category, body.published,
        )
    return serialize_post(row)


@api_router.delete("/blog/posts/{post_id}")
async def delete_post(post_id: str, admin=Depends(get_current_admin)):
    async with pool.acquire() as conn:
        await conn.execute("DELETE FROM blog_posts WHERE id=$1", post_id)
    return {"success": True}


@api_router.post("/blog/upload-image")
async def upload_image(
    file: UploadFile = File(...),
    admin=Depends(get_current_admin)
):
    ext = file.filename.rsplit(".", 1)[-1].lower() if "." in file.filename else "png"

    content_type = (
        storage_lib.MIME_TYPES.get(ext)
        or file.content_type
        or "application/octet-stream"
    )

    path = f"{storage_lib.APP_NAME}/blog/{uuid.uuid4()}.{ext}"

    data = await file.read()

    result = await asyncio.to_thread(
        storage_lib.put_object,
        path,
        data,
        content_type,
    )

    return {
        "path": result["url"]
    }


# ---------- Sitemap ----------
@api_router.get("/sitemap.xml")
async def sitemap(request: Request):
    base = os.environ.get("PUBLIC_SITE_URL") or str(request.base_url).rstrip("/")
    base = base.replace("http://", "https://")
    async with pool.acquire() as conn:
        rows = await conn.fetch("SELECT slug, updated_at FROM blog_posts WHERE published=true ORDER BY updated_at DESC")
    urls = [(f"{base}/", None), (f"{base}/blog", None)]
    for r in rows:
        urls.append((f"{base}/blog/{r['slug']}", r["updated_at"].date().isoformat()))
    items = ""
    for loc, lastmod in urls:
        items += f"<url><loc>{loc}</loc>" + (f"<lastmod>{lastmod}</lastmod>" if lastmod else "") + "</url>"
    xml = f'<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">{items}</urlset>'
    return Response(content=xml, media_type="application/xml")


@api_router.get("/rss.xml")
async def rss(request: Request):
    base = os.environ.get("PUBLIC_SITE_URL") or str(request.base_url).rstrip("/")
    base = base.replace("http://", "https://")
    async with pool.acquire() as conn:
        rows = await conn.fetch("SELECT slug, title, excerpt, category, created_at FROM blog_posts WHERE published=true ORDER BY created_at DESC LIMIT 50")
    items = ""
    for r in rows:
        link = f"{base}/blog/{r['slug']}"
        pub = r["created_at"].strftime("%a, %d %b %Y %H:%M:%S +0000")
        items += (
            "<item>"
            f"<title>{html.escape(r['title'])}</title>"
            f"<link>{link}</link>"
            f"<guid isPermaLink=\"true\">{link}</guid>"
            f"<pubDate>{pub}</pubDate>"
            f"<category>{html.escape(r['category'] or 'News')}</category>"
            f"<description>{html.escape(r['excerpt'] or '')}</description>"
            "</item>"
        )
    xml = (
        '<?xml version="1.0" encoding="UTF-8"?>'
        '<rss version="2.0"><channel>'
        "<title>ViceHub Journal</title>"
        f"<link>{base}/blog</link>"
        "<description>GTA 6 news, guides and ViceHub updates.</description>"
        "<language>en-us</language>"
        f"{items}"
        "</channel></rss>"
    )
    return Response(content=xml, media_type="application/rss+xml")


app.include_router(api_router)
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)
