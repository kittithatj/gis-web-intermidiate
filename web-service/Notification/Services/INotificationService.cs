using web_service.Notification.Models;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace web_service.Notification.Services;

public interface INotificationService
{
    Task<int> SendMessageAsync(List<string> tokens, NotificationMessage notification);

    Task<int> SendMessageAsync(DataTable dataTable);
}