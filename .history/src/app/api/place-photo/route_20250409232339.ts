import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const photoReference = searchParams.get('photoReference');
    
    if (!photoReference) {
      return NextResponse.json(
        { error: 'Photo reference is required' },
        { status: 400 }
      );
    }

    const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!googleMapsApiKey) {
      return NextResponse.json(
        { error: 'Google Maps API key is not configured' },
        { status: 500 }
      );
    }

    // Add accept header to force image response
    const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photoReference}&key=${googleMapsApiKey}`;
    
    const response = await fetch(photoUrl, {
      headers: {
        'Accept': 'image/*'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch photo: ${response.statusText}`);
    }

    // Get the response headers
    const headers = new Headers();
    response.headers.forEach((value, key) => {
      // Forward content-type and cache-control headers
      if (key.toLowerCase() === 'content-type' || 
          key.toLowerCase() === 'cache-control') {
        headers.set(key, value);
      }
    });

    // Set cache control if not present
    if (!headers.has('cache-control')) {
      headers.set('cache-control', 'public, max-age=86400'); // 24 hours cache
    }

    // Stream the response
    return new NextResponse(response.body, {
      status: response.status,
      headers,
    });

  } catch (error) {
    console.error('Error fetching place photo:', error);
    return NextResponse.json(
      { error: 'Failed to fetch photo' },
      { status: 500 }
    );
  }
}
