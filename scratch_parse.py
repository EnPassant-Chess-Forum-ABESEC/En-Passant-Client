import json

try:
    with open('C:\\\\Users\\\\ASUS\\\\en-passant-frontend-v1\\\\scratch_lighthouse.json', 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Remove XML tags if present
    content = content.replace('<USER_REQUEST>', '').replace('</USER_REQUEST>', '').strip()
    
    # Try parsing
    data = json.loads(content)
    
    perf = data.get('categories', {}).get('performance', {}).get('score')
    if perf is not None:
        print(f"Performance Score: {perf * 100}")
    else:
        print("Performance score not found in JSON structure.")
except Exception as e:
    print(f"Error parsing JSON: {e}")
    # try to regex search
    import re
    match = re.search(r'"performance"\s*:\s*\{[^}]*?"score"\s*:\s*([\d\.]+)', content)
    if match:
        print(f"Regex Performance Score: {float(match.group(1)) * 100}")
    else:
        print("Regex also failed to find score.")
