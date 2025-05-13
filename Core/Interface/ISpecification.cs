using System.Linq.Expressions;

namespace Core.Interface;

public interface ISpecification<T>
{
    Expression<Func<T, bool>>? Criteria { get; }
    Expression<Func<T, object>>? OrderBy { get; }
    Expression<Func<T, object>>? OrderByDescending { get; }
    bool isDistinct { get; }
}

public interface ISpecification<T, TResult> : ISpecification<T>
{
    // our expression will take a function of type T and return a function of type TResult
    // this is used for projection (allows use to return a different type than T)
    // for example, we can return a list of ProductDto instead of Product
    Expression<Func<T, TResult>>? Select { get; }
}