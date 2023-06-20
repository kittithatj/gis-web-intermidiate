using AtlasX.Engine.AppSettings;
using web_service.OAuth.Models;
using web_service.OAuth.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using web_service.OAuth.Dto;

namespace web_service.OAuth.Services;

public interface IAppAuthenService
{
    IActionResult Authorization(ControllerBase controllerBase,
        IAuthorizationCodeRepository authorizationCodeRepository, IUserInfoRepository userInfoRepository,
        AuthorizeRequestDto model, IOAuth appSettingsOAuth);

    Task<IActionResult> TokenAsync(ControllerBase controllerBase, IUserTokenRepository userTokenRepository,
        IUserInfoRepository userInfoRepository, IAuthorizationCodeRepository authorizationCodeRepository,
        TokenRequestDto model, IOAuth appSettingsOAuth, string codeVerifier);

    bool Verify(VerifyRequestDto verifyRequest);
    VerifyCode GenerateVerifyCode();
    bool IdentityExisting(VerifyType verifyType, string identity);
}