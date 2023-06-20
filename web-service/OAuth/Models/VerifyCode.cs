using System;

namespace web_service.OAuth.Models;

public class VerifyCode
{
    public string Code { get; set; }
    public DateTime Expires { get; set; }
    public int Age { get; set; }
}