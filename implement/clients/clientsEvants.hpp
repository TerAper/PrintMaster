#include "../dataBase.hpp"
#include "../evantSwitch.hpp"
using request = boost::beast::http::request<boost::beast::http::string_body>;
using response = boost::beast::http::response<boost::beast::http::string_body>; 
using FunctionPtr = void(*)(const request&, response&, DataBase&);

void add_client(const request &req, response &res, DataBase &db);
void search_client(const request &req, response &res, DataBase &db);
void update_client(const request &req, response &res, DataBase &db);
void delete_client(const request &req, response &res, DataBase &db);


void clientsEvantsInitalaizer(EvantSwitch& evantSwitch);