#pragma once
#include "dataBase.hpp"
#include <map>
#include <string>
#include <boost/beast/http/status.hpp>
#include <nlohmann/json_fwd.hpp>
#include <string>
#include <boost/beast/core.hpp>
#include <boost/beast/http.hpp>
#include <boost/asio.hpp>
#include <boost/beast/http/verb.hpp>


//const boost::beast::http::request<boost::beast::http::string_body>& req, boost::beast::http::response<boost::beast::http::string_body>& res , DataBase& db)
using request = boost::beast::http::request<boost::beast::http::string_body>;
using response = boost::beast::http::response<boost::beast::http::string_body>; 
using FunctionPtr = void(*)(const request&, response&, DataBase&);

class EvantSwitch{
public:
    void addEvant(std::string EvantName, FunctionPtr);
    FunctionPtr getEvantHendler(request& request);
private:
    std::string getCleanTarget(std::string target);
private:
    std::map<std::string, FunctionPtr> evantsMap;
};