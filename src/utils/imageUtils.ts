/**
 * Google Places Photo reference를 내부 API 엔드포인트 URL로 변환합니다.
 */
export function getPlacePhotoUrl(photoReference: string | null | undefined): string {
  if (!photoReference) {
    return '/images/placeholder.jpg'; // 기본 이미지 경로
  }
  
  return `/api/place-photo?photoReference=${encodeURIComponent(photoReference)}`;
}
