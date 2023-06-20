using System.Net.Mail;
using AtlasX.Engine.Connector;

namespace web_service.Mail.Services;

public interface IAppMailService
{
    bool Send(MailMessage mailMessage);

    MailMessage CreateMessageFromRequest(QueryParameter parameter);
}