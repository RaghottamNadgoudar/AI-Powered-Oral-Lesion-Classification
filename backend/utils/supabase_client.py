"""
Supabase Client for Community Features
Handles connection to Supabase for anonymous community platform
"""

import os
from supabase import create_client, Client
import random

# Supabase configuration
SUPABASE_URL = os.getenv('SUPABASE_URL', 'https://bezpsrrsdiagtilqjibp.supabase.co')
SUPABASE_ANON_KEY = os.getenv('SUPABASE_ANON_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJlenBzcnJzZGlhZ3RpbHFqaWJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwMDU2MzksImV4cCI6MjA4NTU4MTYzOX0.ndXNMjs-WmY2bPnombwwQ3PBF-f8WVDYXI6Va3jRRZs')

# Singleton client instance
_supabase_client: Client = None

def get_supabase_client() -> Client:
    """Get or create the Supabase client singleton"""
    global _supabase_client
    if _supabase_client is None:
        _supabase_client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)
        print(f"Connected to Supabase: {SUPABASE_URL}")
    return _supabase_client


# Word lists for generating anonymous display names
ADJECTIVES = [
    "Hopeful", "Brave", "Gentle", "Strong", "Calm", "Wise", "Kind", "Bright",
    "Peaceful", "Resilient", "Caring", "Warm", "Steady", "Positive", "Healing",
    "Radiant", "Serene", "Graceful", "Mindful", "Courageous", "Tender", "Vibrant"
]

NOUNS = [
    "Star", "Moon", "Sun", "Sky", "River", "Mountain", "Ocean", "Forest",
    "Garden", "Meadow", "Phoenix", "Butterfly", "Dove", "Eagle", "Lotus",
    "Aurora", "Rainbow", "Willow", "Cedar", "Horizon", "Dawn", "Breeze"
]


def generate_anonymous_name() -> str:
    """Generate a random anonymous display name"""
    adjective = random.choice(ADJECTIVES)
    noun = random.choice(NOUNS)
    number = random.randint(1000, 9999)
    return f"{adjective}_{noun}_{number}"


def generate_avatar_seed() -> str:
    """Generate a random seed for avatar generation"""
    return ''.join(random.choices('abcdefghijklmnopqrstuvwxyz0123456789', k=16))


def create_anonymous_profile(role: str = 'user') -> dict:
    """Create a new anonymous profile"""
    client = get_supabase_client()
    
    profile_data = {
        'display_name': generate_anonymous_name(),
        'avatar_seed': generate_avatar_seed(),
        'role': role
    }
    
    result = client.table('anonymous_profiles').insert(profile_data).execute()
    
    if result.data:
        return result.data[0]
    return None


def get_profile(profile_id: str) -> dict:
    """Get an anonymous profile by ID"""
    client = get_supabase_client()
    result = client.table('anonymous_profiles').select('*').eq('id', profile_id).single().execute()
    return result.data


# Community Posts functions
def create_post(profile_id: str, title: str, content: str, category: str = 'general', image_url: str = None) -> dict:
    """Create a new community post"""
    client = get_supabase_client()
    
    post_data = {
        'anonymous_profile_id': profile_id,
        'title': title,
        'content': content,
        'category': category
    }
    
    if image_url:
        post_data['image_url'] = image_url
    
    result = client.table('community_posts').insert(post_data).execute()
    return result.data[0] if result.data else None


def get_posts(category: str = None, limit: int = 20, offset: int = 0) -> list:
    """Get community posts with optional category filter"""
    client = get_supabase_client()
    
    query = client.table('community_posts').select(
        '*, anonymous_profiles(display_name, avatar_seed, role)'
    ).order('created_at', desc=True).limit(limit).offset(offset)
    
    if category:
        query = query.eq('category', category)
    
    result = query.execute()
    return result.data


def get_post(post_id: str) -> dict:
    """Get a single post with its comments"""
    client = get_supabase_client()
    
    result = client.table('community_posts').select(
        '*, anonymous_profiles(display_name, avatar_seed, role)'
    ).eq('id', post_id).single().execute()
    
    return result.data


# Recovery Stories functions
def create_story(profile_id: str, title: str, story_content: str, diagnosis_type: str = None,
                 treatment_summary: str = None, recovery_duration: str = None,
                 current_status: str = None, helpful_tips: str = None) -> dict:
    """Create a new recovery story"""
    client = get_supabase_client()
    
    story_data = {
        'anonymous_profile_id': profile_id,
        'title': title,
        'story_content': story_content
    }
    
    if diagnosis_type:
        story_data['diagnosis_type'] = diagnosis_type
    if treatment_summary:
        story_data['treatment_summary'] = treatment_summary
    if recovery_duration:
        story_data['recovery_duration'] = recovery_duration
    if current_status:
        story_data['current_status'] = current_status
    if helpful_tips:
        story_data['helpful_tips'] = helpful_tips
    
    result = client.table('recovery_stories').insert(story_data).execute()
    return result.data[0] if result.data else None


def get_stories(diagnosis_type: str = None, featured_only: bool = False, 
                limit: int = 20, offset: int = 0) -> list:
    """Get recovery stories with optional filters"""
    client = get_supabase_client()
    
    query = client.table('recovery_stories').select(
        '*, anonymous_profiles(display_name, avatar_seed, role)'
    ).order('created_at', desc=True).limit(limit).offset(offset)
    
    if diagnosis_type:
        query = query.eq('diagnosis_type', diagnosis_type)
    if featured_only:
        query = query.eq('is_featured', True)
    
    result = query.execute()
    return result.data


def get_story(story_id: str) -> dict:
    """Get a single recovery story"""
    client = get_supabase_client()
    
    result = client.table('recovery_stories').select(
        '*, anonymous_profiles(display_name, avatar_seed, role)'
    ).eq('id', story_id).single().execute()
    
    return result.data


# Comments functions
def create_comment(profile_id: str, content: str, post_id: str = None, 
                   story_id: str = None, parent_comment_id: str = None) -> dict:
    """Create a new comment"""
    client = get_supabase_client()
    
    # Check if the profile is an expert
    profile = get_profile(profile_id)
    is_expert = profile and profile.get('role') == 'expert'
    
    comment_data = {
        'anonymous_profile_id': profile_id,
        'content': content,
        'is_expert_reply': is_expert
    }
    
    if post_id:
        comment_data['post_id'] = post_id
    if story_id:
        comment_data['story_id'] = story_id
    if parent_comment_id:
        comment_data['parent_comment_id'] = parent_comment_id
    
    result = client.table('comments').insert(comment_data).execute()
    
    # Update comment count on the post or story
    if result.data and post_id:
        client.rpc('increment_comment_count_post', {'post_id': post_id}).execute()
    elif result.data and story_id:
        client.rpc('increment_comment_count_story', {'story_id': story_id}).execute()
    
    return result.data[0] if result.data else None


def get_comments(post_id: str = None, story_id: str = None) -> list:
    """Get comments for a post or story"""
    client = get_supabase_client()
    
    query = client.table('comments').select(
        '*, anonymous_profiles(display_name, avatar_seed, role)'
    ).order('created_at', desc=False)
    
    if post_id:
        query = query.eq('post_id', post_id)
    elif story_id:
        query = query.eq('story_id', story_id)
    
    result = query.execute()
    return result.data


# Reactions functions
def add_reaction(profile_id: str, reaction_type: str = 'upvote',
                 post_id: str = None, story_id: str = None, comment_id: str = None) -> dict:
    """Add a reaction to a post, story, or comment"""
    client = get_supabase_client()
    
    reaction_data = {
        'anonymous_profile_id': profile_id,
        'reaction_type': reaction_type
    }
    
    if post_id:
        reaction_data['post_id'] = post_id
    if story_id:
        reaction_data['story_id'] = story_id
    if comment_id:
        reaction_data['comment_id'] = comment_id
    
    try:
        result = client.table('reactions').insert(reaction_data).execute()
        return result.data[0] if result.data else None
    except Exception as e:
        # Likely a duplicate reaction
        print(f"Reaction error: {e}")
        return None


def remove_reaction(profile_id: str, reaction_type: str = 'upvote',
                    post_id: str = None, story_id: str = None, comment_id: str = None) -> bool:
    """Remove a reaction"""
    client = get_supabase_client()
    
    query = client.table('reactions').delete().eq('anonymous_profile_id', profile_id).eq('reaction_type', reaction_type)
    
    if post_id:
        query = query.eq('post_id', post_id)
    if story_id:
        query = query.eq('story_id', story_id)
    if comment_id:
        query = query.eq('comment_id', comment_id)
    
    result = query.execute()
    return True
