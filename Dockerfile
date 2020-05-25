FROM retaildevcrew/webvalidate

WORKDIR /app


# Copies your code file from your action repository to the filesystem path `/` of the container
COPY entrypoint.sh /entrypoint.sh


#ENTRYPOINT ["sleep","300"]
ENTRYPOINT [ "dotnet", "--list-runtimes" ]
# Code file to execute when the docker container starts up (`entrypoint.sh`)
#ENTRYPOINT ["dotnet","webvalidate.dll","--host" ,"https://www.microsoft.com","--files","msft.json"]


