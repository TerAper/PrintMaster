#include "../dataBase.hpp"
#include "../evantSwitch.hpp"
using request = boost::beast::http::request<boost::beast::http::string_body>;
using response = boost::beast::http::response<boost::beast::http::string_body>; 
using FunctionPtr = void(*)(const request&, response&, DataBase&);

void add_model(const request &req, response &res, DataBase &db);
void get_models(const request &req, response &res, DataBase &db);



void modelsEvantsInitalaizer(EvantSwitch& evantSwitch);