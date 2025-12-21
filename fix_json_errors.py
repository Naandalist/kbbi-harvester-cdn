#!/usr/bin/env python3
"""
Script untuk memperbaiki kesalahan sintaks JSON di folder kbbi-harvester-cdn.

Pola kesalahan utama:
- Ada duplicate closing brace `}` yang seharusnya tidak ada
- Baris: }\\n          }\\n        ] -> seharusnya }\\n        ]
"""

import json
import os
import re
# from pathlib import Path

def find_json_errors(directory):
    """Mencari semua file JSON dengan error."""
    errors = []
    for root, dirs, files in os.walk(directory):
        for f in files:
            if f.endswith('.json'):
                path = os.path.join(root, f)
                try:
                    with open(path, 'r', encoding='utf-8') as file:
                        json.load(file)
                except json.JSONDecodeError as e:
                    errors.append((path, e.lineno, e.colno, e.msg))
                except Exception as e:
                    errors.append((path, 0, 0, str(e)))
    return errors

def fix_json_file(filepath, error_line, error_col, error_msg):
    """Memperbaiki file JSON."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    fixes_applied = []
    
    lines = content.split('\n')
    
    # Error type 1: Duplicate closing brace - remove the extra }
    # Pattern: line ends with }, next line is just } with whitespace, following by ]
    if 'Expecting \',\' delimiter' in error_msg:
        error_idx = error_line - 1  # 0-indexed
        
        if error_idx < len(lines):
            error_line_content = lines[error_idx].strip()
            
            # Jika baris error hanya berisi `}`
            if error_line_content == '}':
                # Cek apakah baris sebelumnya juga diakhiri `}`
                if error_idx > 0:
                    prev_line = lines[error_idx - 1].strip()
                    if prev_line.endswith('}') or prev_line == '}':
                        # Cek apakah baris berikutnya dimulai dengan `]`
                        if error_idx + 1 < len(lines):
                            next_line = lines[error_idx + 1].strip()
                            if next_line.startswith(']'):
                                # Hapus baris error (duplicate })
                                del lines[error_idx]
                                fixes_applied.append(f"Removed duplicate closing brace at line {error_line}")
    
    # Error type 2: Expecting property name - double opening brace
    if 'Expecting property name' in error_msg:
        error_idx = error_line - 1
        if error_idx < len(lines):
            error_line_content = lines[error_idx].strip()
            # Jika baris error hanya berisi `{`
            if error_line_content == '{':
                # Cek baris sebelumnya apakah ada `{`
                if error_idx > 0:
                    prev_line = lines[error_idx - 1].strip()
                    if prev_line.endswith('{') or prev_line == '{':
                        # Hapus baris error (duplicate {)
                        del lines[error_idx]
                        fixes_applied.append(f"Removed duplicate opening brace at line {error_line}")
    
    # Error type 3: Array placeholder [...] 
    new_content = '\n'.join(lines)
    pattern_placeholder = re.compile(r'\[\.\.\.\s*\]')
    if pattern_placeholder.search(new_content):
        new_content = pattern_placeholder.sub('[]', new_content)
        fixes_applied.append("Replaced [...] placeholder with []")
        lines = new_content.split('\n')
    
    # Error type 4: Missing comma in line (like sendok.json Line 82, Col 183)
    # Check if error is in middle of line (col > 10)
    if 'Expecting \',\' delimiter' in error_msg and error_col > 50:
        error_idx = error_line - 1
        if error_idx < len(lines):
            line = lines[error_idx]
            # Insert comma before the position
            if error_col - 1 < len(line):
                # Find the } before error position
                pos = error_col - 2  # Convert to 0-indexed, move back
                while pos > 0 and line[pos] != '}':
                    pos -= 1
                if pos > 0 and line[pos] == '}':
                    # Insert comma after this }
                    lines[error_idx] = line[:pos+1] + ',' + line[pos+1:]
                    fixes_applied.append(f"Added missing comma at line {error_line}, col {pos+2}")
    
    new_content = '\n'.join(lines)
    
    if new_content != original_content:
        try:
            json.loads(new_content)
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            return True, fixes_applied
        except json.JSONDecodeError as e:
            return False, [f"Fix applied but still has error: Line {e.lineno}, {e.msg}"]
    
    return False, ["No automatic fix available"]

def main():
    print("=" * 70)
    print("JSON ERROR FIXER v3 - KBBI Harvester CDN")
    print("=" * 70)
    
    # Cari semua file dengan error
    errors = find_json_errors('.')
    print(f"\nDitemukan {len(errors)} file dengan error\n")
    
    fixed = 0
    failed = []
    
    for path, line, col, msg in errors:
        print(f"\nProcessing: {path}")
        print(f"  Error: Line {line}, Col {col}: {msg}")
        
        success, fixes = fix_json_file(path, line, col, msg)
        if success:
            print(f"  ✓ FIXED: {', '.join(fixes)}")
            fixed += 1
        else:
            print(f"  ✗ NOT FIXED: {fixes[0] if fixes else 'Unknown'}")
            failed.append((path, line, col, msg, fixes[0] if fixes else 'Unknown'))
    
    print("\n" + "=" * 70)
    print("SUMMARY")
    print("=" * 70)
    print(f"Total errors: {len(errors)}")
    print(f"Fixed: {fixed}")
    print(f"Failed: {len(failed)}")
    
    if failed:
        print("\nFiles that still need fix:")
        for path, line, col, msg, reason in failed:
            print(f"  - {path} (Line {line}): {reason}")
    
    # Verifikasi akhir
    print("\n" + "=" * 70)
    print("VERIFICATION")
    print("=" * 70)
    remaining_errors = find_json_errors('.')
    print(f"Remaining errors after fix: {len(remaining_errors)}")
    
    if remaining_errors:
        print("\nRemaining errors:")
        for path, line, col, msg in remaining_errors:
            print(f"  - {path}: Line {line}, Col {col}: {msg}")

if __name__ == "__main__":
    main()
