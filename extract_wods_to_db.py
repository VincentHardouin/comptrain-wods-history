import re
import sqlite3
from datetime import datetime, timedelta
import argparse

# Paths
markdown_file = './wods.md'
db_path = './api/prisma/wods.db'

def extract_wods_from_markdown(md_path):
    wods = []
    with open(md_path, 'r', encoding='utf-8') as f:
        content = f.read()
    # Split by section
    sections = re.split(r'^##\s+', content, flags=re.MULTILINE)
    for section in sections[1:]:
        lines = section.strip().splitlines()
        if not lines:
            continue
        pub_date = lines[0].strip()
        try:
            date_obj = datetime.strptime(pub_date[:10], '%Y-%m-%d')
            wod_date = (date_obj + timedelta(days=1)).strftime('%Y-%m-%d')
            pub_date_fmt = date_obj.strftime('%Y-%m-%d')
        except Exception:
            pub_date_fmt = pub_date
            wod_date = None  # Use None instead of empty string for invalid date
        # Title extraction (same as before)
        title = ''
        for l in lines:
            m = re.search(r'“([^”]+)”', l)
            if m:
                title = m.group(1).strip()
                break
        if not title:
            for l in lines:
                if 'workout' in l.lower() or 'benchmark' in l.lower():
                    title = l.strip().replace('Workout', '').replace('»', '').strip()
                    break
        if not title:
            for l in lines:
                if l.strip() and not l.strip().startswith('**Image') and not l.strip().startswith('```'):
                    title = l.strip()
                    break
        # Extract WOD content: all code blocks (``` ... ```) except the first one
        code_blocks = re.findall(r'```([\s\S]*?)```', section)
        if len(code_blocks) > 1:
            wod_content = '\n\n'.join([block.strip() for block in code_blocks[1:]])
        elif code_blocks:
            wod_content = code_blocks[0].strip()
        else:
            wod_content = ''
        # Convert to timestamp if needed
        def to_timestamp(val):
            if isinstance(val, int):
                return val
            if isinstance(val, str):
                val = val.strip()
                if val.isdigit():
                    return int(val)
                try:
                    dt = datetime.strptime(val, '%Y-%m-%d')
                    return int(dt.timestamp())
                except Exception:
                    return None
            return None

        wods.append((title, wod_content, pub_date_fmt, to_timestamp(wod_date)))
    return wods

def insert_wods(conn, wods):
    script_now = int(datetime.utcnow().timestamp())
    for title, content, pub_date, wod_date in wods:
        conn.execute('INSERT INTO workouts (title, content, createdAt, updatedAt) VALUES (?, ?, ?, ?)', (title, content, wod_date, script_now))
    conn.commit()

def main():
    parser = argparse.ArgumentParser(description="Extract WODs from markdown and insert into database.")
    parser.add_argument('--commit', action='store_true', help='Insert extracted WODs into database (not a dry run)')
    args = parser.parse_args()

    wods = extract_wods_from_markdown(markdown_file)
    if not args.commit:
        print(f"[DRY RUN] {len(wods)} WODs would be inserted:")
        for title, content, pub_date, wod_date in wods:
            print(f"Title: {title}\nPublication: {pub_date} | WOD date: {wod_date}\nContent:\n{content}\n{'-'*40}")
        return
    conn = sqlite3.connect(db_path)
    insert_wods(conn, wods)
    conn.close()
    print(f"Inserted {len(wods)} WODs into the database.")

if __name__ == '__main__':
    main()
