using web_service.OAuth.Models;

namespace web_service.OAuth.Repositories.Interfaces;

public interface IUserInfoRepository
{
    UserInfo Get(string username, string password, string dataSource);
    UserInfo Get(int userId);
    UserInfo Get(string username);
}