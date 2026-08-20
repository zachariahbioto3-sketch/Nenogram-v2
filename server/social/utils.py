import re

def extract_hashtags(text):
    return re.findall(r'#(\w+)', text)

def extract_mentions(text):
    return re.findall(r'@(\w+)', text)
