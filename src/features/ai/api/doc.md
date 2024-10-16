```shell
curl -X POST "https://models.inference.ai.azure.com/chat/completions" \
 -H "Content-Type: application/json" \
 -H "Authorization: Bearer $GITHUB_TOKEN" \
 -d '{
"messages": [
{
"role": "system",
"content": "You are a helpful assistant."
},
{
"role": "user",
"content": "What is the capital of France?"
}
],
"temperature": 1.0,
"top_p": 1.0,
"max_tokens": 1000,
"model": "gpt-4o-mini"
}'

```
