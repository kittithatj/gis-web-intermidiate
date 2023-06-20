using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace web_service.OAuth.Dto;

public class IntrospectionRequestDto
{
    [BindProperty(Name = "token")]
    [BindRequired]
    public string Token { get; set; }
}