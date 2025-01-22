#include "../dataBase.hpp"
#include "../evantSwitch.hpp"
using request = boost::beast::http::request<boost::beast::http::string_body>;
using response = boost::beast::http::response<boost::beast::http::string_body>; 
using FunctionPtr = void(*)(const request&, response&, DataBase&);

void addprinters(const request &req, response &res, DataBase &db);
void getPrinters(const request &req, response &res, DataBase &db);

void printerEvantsInitalaizer(EvantSwitch& evantSwitch);