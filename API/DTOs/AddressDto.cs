using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class AddressDto
{
    // we are using required annotation here to make sure that the properties are required
    // it will allow us to return modelstate errors in a format that is easy to read
    // and it will also allow us to use the required annotation in the frontend
    [Required]
    public string Line1 { get; set; } = string.Empty;

    public string? Line2 { get; set; }

    [Required]
    public string City { get; set; } = string.Empty;

    [Required]
    public string State { get; set; } = string.Empty;

    [Required]
    public string PostalCode { get; set; } = string.Empty;

    [Required]
    public string Country { get; set; } = string.Empty;
}