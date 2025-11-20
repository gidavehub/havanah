import React from 'react';
import UnifiedProfile from '@/components/profile/profile';
import { getProfileById } from '@/lib/user-service';
import { Metadata } from 'next';

type Props = {
  params: { id: string }
};

/**
 * Server-side Metadata Generation
 * Fetches user data to display dynamic titles like "Sarah Jones - Agent | Havanah"
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Fetch public profile data
  const profile = await getProfileById(params.id);

  if (!profile) {
    return {
      title: 'Profile Not Found | Havanah',
      description: 'The user profile you are looking for does not exist.',
    };
  }

  const roleLabel = profile.role === 'agent' ? 'Agent' : 'Member';
  const description = profile.bio 
    ? profile.bio.substring(0, 160) 
    : `View ${profile.displayName}'s profile, listings, and connections on Havanah.`;

  return {
    title: `${profile.displayName} - ${roleLabel} | Havanah`,
    description: description,
    openGraph: {
      title: `${profile.displayName} | Havanah ${roleLabel}`,
      description: description,
      images: profile.photoURL ? [profile.photoURL] : [],
      type: 'profile',
    },
  };
}

export default function PublicProfilePage({ params }: Props) {
  return (
    <main style={{ 
      minHeight: '100vh', 
      background: '#f9fafb', 
      paddingBottom: '4rem' 
    }}>
      <UnifiedProfile profileId={params.id} />
    </main>
  );
}