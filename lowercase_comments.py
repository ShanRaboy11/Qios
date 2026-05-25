import os
import re

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Regex for // comments
    # We want to match // optionally followed by spaces, then a capital letter, then the rest of the line
    def replace_slash(match):
        prefix = match.group(1) # //\s*
        first_letter = match.group(2) # first character after spaces
        rest = match.group(3)
        return prefix + first_letter.lower() + rest

    new_content = re.sub(r'(//\s*)([A-Z])(.*?)$', replace_slash, content, flags=re.MULTILINE)

    # Regex for /* comments */ and {/* comments */}
    def replace_jsx(match):
        prefix = match.group(1) 
        first_letter = match.group(2)
        rest = match.group(3)
        return prefix + first_letter.lower() + rest

    # Match /* or {/* optionally followed by spaces, then a capital letter
    new_content = re.sub(r'((?:\{?\/\*)\s*)([A-Z])(.*?\*\/\}?)', replace_jsx, new_content, flags=re.DOTALL)

    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        return True
    return False

def main():
    root_dir = os.path.join(os.path.dirname(__file__), 'src')
    count = 0
    for subdir, _, files in os.walk(root_dir):
        for file in files:
            if file.endswith(('.ts', '.tsx', '.js', '.jsx')):
                filepath = os.path.join(subdir, file)
                if process_file(filepath):
                    count += 1
    print(f"Updated comments in {count} files.")

if __name__ == '__main__':
    main()
