class ApiYoutubeService {
  private readonly apiKey = "AIzaSyA3m56gu6RJJ9etf1HRiP3m9LK2XmIVjxA";
  private readonly baseUrl = "https://www.googleapis.com/youtube/v3/search";

  // Método para buscar videos
  async GET_NAME(query: string, maxResults = 5) {
    const url = `${this.baseUrl}?part=snippet&q=${encodeURIComponent(
      query
    )}&type=video&maxResults=${maxResults}&key=${this.apiKey}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();
      return data.items || [];
    } catch (error) {
      console.error("Error al obtener videos:", error);
      throw error;
    }
  }
}

export const service = new ApiYoutubeService();