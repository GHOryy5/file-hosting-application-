import hashlib

def calculate_sha256(file):
    """
    Calculates the SHA-256 (64-char) hash.
    """
    file.seek(0)
    
    # FIX: This MUST be sha256()
    hash_obj = hashlib.sha256() 
    
    for chunk in file.chunks():
        hash_obj.update(chunk)
        
    hex_digest = hash_obj.hexdigest()
    file.seek(0)
    
    return hex_digest