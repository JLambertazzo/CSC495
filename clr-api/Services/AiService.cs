using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using clr_api.Models;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Bson.IO;

namespace clr_api.Services;

public class AiService

{
    private readonly string _hfToken;
    
    public AiService(IOptions<ApiKeys> apiKeys)
    {
        _hfToken = apiKeys.Value.HfToken;
    }

    private string GetPrompt(string body) =>
        $"<start_of_turn>user I have a web app where students can collaborate on solutions to computer science problems. If stuck on a problem, a student can post their attempt so far and get other students’ help with building a final solution. The only restriction is that the students cannot make a post if they did not actually attempt to solve the problem. That’s where you come in. I want to give you a string of text, and you give me a number from 1 to 10, where you tell me how much you think the student attempted to solve the problem, with 1 being not at all, and 10 being a serious attempt. It’s ok if they attempted it but got stuck somewhere, that’s fully valid. But they must have at least started something. Can you give your output in this format? Score: [your score] $ Assessment: [your reasoning] Here is the text: {body}.<end_of_turn><start_of_turn>model";
    private readonly string _address = "https://api-inference.huggingface.co/models/google/gemma-7b-it";
    
    public class Output
    {
        public string generated_text { get; set; }
    }

    public async Task<string?> GetAiResponse(string body)
    {
        var client = new HttpClient();
        client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _hfToken);

        var requestData = new { inputs = body };
        var jsonBody = JsonSerializer.Serialize(requestData);

        var content = new StringContent(jsonBody, Encoding.UTF8, "application/json");

        HttpResponseMessage response = await client.PostAsync(_address, content);

        if (!response.IsSuccessStatusCode)
        {
            return null;
        }
        var result = await response.Content.ReadAsStringAsync();
        Console.WriteLine(result);
        var responseObj = JsonSerializer.Deserialize<Output>(result.Substring(1, result.Length - 2));
        var outputData = responseObj.generated_text;
        return outputData;
    }

    public async Task<Ai> GetAiReview(string body)
    {
        var result = await GetAiResponse(GetPrompt(body));
        if (result is null)
        {
            return new Ai
            {
                AiScore = -1,
                AiReason = "Internal Error: Failed to get AI Response"
            };
        }
        var aiAnswer = result.Split("<start_of_turn>model")[1];
        var formatted = aiAnswer.Replace("*", "").Split('$');
        var score = formatted[0].Split(':')[1].Trim();
        var assessment = formatted[1].Split(':')[1].Trim();
        return new Ai
        {
            AiScore = Int32.Parse(score),
            AiReason = assessment
        };
    }
}