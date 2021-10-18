output "client_side_id" {
    value       =  data.launchdarkly_environment.environment.client_side_id
    description = "Environment client Id"
    sensitive=true
}