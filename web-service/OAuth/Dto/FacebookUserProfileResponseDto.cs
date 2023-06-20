using Newtonsoft.Json;

namespace web_service.OAuth.Dto;

public class FacebookUserProfileResponseDto
{
    [JsonProperty("id")] public string Id { get; set; }

    [JsonProperty("name")] public string Name { get; set; }

    public ErrorResponseDto Error { get; set; }
}