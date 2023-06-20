using Newtonsoft.Json;

namespace web_service.OAuth.Dto;

public class OAuthResponseErrorDto
{
    [JsonProperty("error")] public string Error { get; set; }

    [JsonProperty("error_description")] public string ErrorDescription { get; set; }

    public OAuthResponseErrorDto(string error, string errorDescription)
    {
        Error = error;
        ErrorDescription = errorDescription;
    }
}