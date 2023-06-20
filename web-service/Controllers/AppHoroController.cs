using Microsoft.AspNetCore.Mvc;
using AtlasX.Engine.Connector;
using System.Collections.Generic;
using System;

namespace web_service.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AppHoroController : ControllerBase
{

    [HttpGet]
    public IActionResult Index()
    {
        var queryParameter = new QueryParameter(Request);
        if (!queryParameter.ContainsKey("name")) return BadRequest("Missing parameter : name");
        string name = queryParameter["name"].ToString();
        var response = new Dictionary<string, object>();
        var ascii = 0;
        foreach (char c in name)
        {
            ascii += (int)c;
        }
        Console.WriteLine(ascii);
        string horoResult = "";
        if (ascii % 10 < 4)
        {
            horoResult = "Bad";
        }
        else if (ascii % 10 < 7)
        {
            horoResult = "So So";
        }
        else
        {
            horoResult = "Good";
        }

        response.Add("status", "success");
        response.Add("name", name);
        response.Add("result", horoResult);
        return Ok(response);

    }
}