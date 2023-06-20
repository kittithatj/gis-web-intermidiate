using Newtonsoft.Json;

namespace web_service.OAuth.Dto;

public class ErrorResponseDto
{
    [JsonProperty("message")] public string Message { get; set; }

    [JsonProperty("type")] public string Type { get; set; }

    [JsonProperty("code")] public int Code { get; set; }

    [JsonProperty("error_subcode")] public int ErrorSubcode { get; set; }

    [JsonProperty("fbtrace_id")] public string FbTraceId { get; set; }
}